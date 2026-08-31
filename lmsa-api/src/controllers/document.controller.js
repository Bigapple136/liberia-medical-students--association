import { supabase } from '../config/supabase.js';

// ─── Helper: check access level ─────────────────────────────────────────────
const canAccess = (doc, user) => {
  switch (doc.access_level) {
    case 'public':
      return true;
    case 'members':
      return !!user;
    case 'executive':
      return user?.role === 'executive' || user?.role === 'admin' || user?.role === 'super_admin';
    case 'admin':
      return user?.role === 'admin' || user?.role === 'super_admin';
    default:
      return !!user;
  }
};

// ─── GET /api/documents ─────────────────────────────────────────────────────
export const getAll = async (req, res) => {
  try {
    // Support optional category filter
    let query = supabase
      .from('documents')
      .select('*')
      .is('committee_id', null)
      .order('created_at', { ascending: false });

    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch documents',
      });
    }

    // Filter by access level based on the requester
    const user = req.user || null;
    const documents = data.filter(doc => canAccess(doc, user));

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
    });
  }
};

// ─── GET /api/documents/:id/download ────────────────────────────────────────
export const download = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check access level
    const user = req.user || null;
    if (!canAccess(doc, user)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this document',
      });
    }

    // Increment download count (fire-and-forget, non-blocking)
    supabase
      .from('documents')
      .update({ downloads: (doc.downloads || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Failed to increment download count:', error);
      });

    res.json({
      success: true,
      file_url: doc.file_url,
    });
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document',
    });
  }
};

// ─── GET /api/documents/admin/all ───────────────────────────────────────────
export const getAllAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .is('committee_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch documents',
      });
    }

    res.json({
      success: true,
      documents: data,
    });
  } catch (error) {
    console.error('Get all documents (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
    });
  }
};

// ─── POST /api/documents ────────────────────────────────────────────────────
export const create = async (req, res) => {
  try {
    const { title, description, category, access_level, file_url, file_type, file_size } = req.body;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        category,
        access_level: access_level || 'members',
        file_url,
        file_type,
        file_size,
        committee_id: null,
        uploaded_by: req.user.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create document',
      });
    }

    res.status(201).json({
      success: true,
      document: data,
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create document',
    });
  }
};

// ─── DELETE /api/documents/:id ──────────────────────────────────────────────
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .is('committee_id', null);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete document',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
    });
  }
};
