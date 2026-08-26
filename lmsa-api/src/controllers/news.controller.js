import { supabase } from '../config/supabase.js';

// ─── GET /api/news ───────────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const from = (page - 1) * limit;

    let query = supabase
      .from('news_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }

    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch news posts',
      });
    }

    res.json({
      success: true,
      posts: data,
      total: count ?? 0,
    });
  } catch (error) {
    console.error('Get all news posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news posts',
    });
  }
};

// ─── GET /api/news/:slug ─────────────────────────────────────────────────────
export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: post, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      return res.status(404).json({
        success: false,
        message: 'News post not found',
      });
    }

    // Fetch associated tags
    const { data: tagRows } = await supabase
      .from('news_post_tags')
      .select('tag:tag_id ( id, name, slug )')
      .eq('news_post_id', post.id);

    const tags = (tagRows || []).map((r) => r.tag).filter(Boolean);

    // Increment views (fire-and-forget — don't block the response)
    supabase
      .from('news_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post.id)
      .then(() => {})
      .catch(() => {});

    res.json({
      success: true,
      post: { ...post, tags },
    });
  } catch (error) {
    console.error('Get news post by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news post',
    });
  }
};

// ─── GET /api/news/admin/all ─────────────────────────────────────────────────
export const getAllAdmin = async (req, res) => {
  try {
    let query = supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch news posts',
      });
    }

    // Attach tag_ids per post (batched — one query for all posts' tag
    // associations, not N+1). Without this, the admin edit form has no
    // way to know a post's existing tags, defaults to an empty array,
    // and silently wipes them on save (update() replaces tag_ids
    // wholesale). getBySlug already does this per-post for the public
    // detail view; this mirrors that for the admin list.
    const postIds = (data || []).map((p) => p.id);
    let tagsByPost = {};

    if (postIds.length > 0) {
      const { data: tagRows } = await supabase
        .from('news_post_tags')
        .select('news_post_id, tag_id')
        .in('news_post_id', postIds);

      tagsByPost = (tagRows || []).reduce((acc, row) => {
        (acc[row.news_post_id] ||= []).push(row.tag_id);
        return acc;
      }, {});
    }

    const posts = (data || []).map((post) => ({
      ...post,
      tag_ids: tagsByPost[post.id] || [],
    }));

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Get all news posts (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news posts',
    });
  }
};

// ─── POST /api/news ──────────────────────────────────────────────────────────
export const create = async (req, res) => {
  try {
    const {
      title, excerpt, content, featured_image_url,
      category, status, tag_ids,
    } = req.body;

    // Don't set slug — the generate_news_slug trigger handles it
    const insertData = {
      title,
      excerpt: excerpt || null,
      content,
      featured_image_url: featured_image_url || null,
      category: category || null,
      author_id: req.user.id,
      status: status || 'draft',
    };

    // Set published_at when creating directly as published
    if (status === 'published') {
      insertData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('news_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create news post',
      });
    }

    // Insert tag associations if provided
    if (tag_ids && tag_ids.length > 0) {
      const tagRows = tag_ids.map((tagId) => ({
        news_post_id: data.id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from('news_post_tags')
        .insert(tagRows);

      if (tagError) {
        console.error('Failed to insert news post tags:', tagError);
      }
    }

    res.status(201).json({
      success: true,
      post: data,
    });
  } catch (error) {
    console.error('Create news post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news post',
    });
  }
};

// ─── PUT /api/news/:id ───────────────────────────────────────────────────────
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, excerpt, content, featured_image_url,
      category, status, tag_ids,
    } = req.body;

    // Fetch current post to check publish transition
    const { data: current } = await supabase
      .from('news_posts')
      .select('status, published_at')
      .eq('id', id)
      .single();

    const updateData = {
      title,
      excerpt: excerpt || null,
      content,
      featured_image_url: featured_image_url || null,
      category: category || null,
      status,
    };

    // Set published_at on first transition to published (preserve original)
    if (
      status === 'published'
      && current?.status !== 'published'
      && !current?.published_at
    ) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('news_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update news post',
      });
    }

    // Replace tag associations if provided
    if (tag_ids !== undefined) {
      // Remove existing tags
      await supabase
        .from('news_post_tags')
        .delete()
        .eq('news_post_id', id);

      // Insert new tags
      if (tag_ids.length > 0) {
        const tagRows = tag_ids.map((tagId) => ({
          news_post_id: id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from('news_post_tags')
          .insert(tagRows);

        if (tagError) {
          console.error('Failed to update news post tags:', tagError);
        }
      }
    }

    res.json({
      success: true,
      post: data,
    });
  } catch (error) {
    console.error('Update news post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news post',
    });
  }
};

// ─── DELETE /api/news/:id ────────────────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete news post',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete news post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete news post',
    });
  }
};

// ─── GET /api/news/tags ──────────────────────────────────────────────────────
export const getTags = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch tags',
      });
    }

    res.json({
      success: true,
      tags: data,
    });
  } catch (error) {
    console.error('Get news tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
    });
  }
};
