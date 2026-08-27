import { supabase } from '../config/supabase.js';

// ─── GET /api/executive ────────────────────────────────────────────────────
// Public — only active positions. Order by position_rank ASC.
export const getAll = async (req, res) => {
  try {
    let query = supabase
      .from('executive_positions')
      .select(`
        *,
        holder:user_id ( id, full_name, profile_photo_url, year_level )
      `)
      .eq('status', 'active')
      .order('position_rank', { ascending: true });

    const { academic_year } = req.query;

    if (academic_year) {
      query = query.eq('academic_year', academic_year);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch executive positions',
      });
    }

    // Flatten user data — mirror membership.controller.js pattern
    const positions = data.map(p => ({
      ...p,
      holder_name: p.holder?.full_name || null,
      holder_photo_url: p.holder?.profile_photo_url || null,
      holder_year_level: p.holder?.year_level || null,
      holder: undefined,
    }));

    res.json({
      success: true,
      positions,
    });
  } catch (error) {
    console.error('Get all executive positions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch executive positions',
    });
  }
};

// ─── GET /api/executive/admin/all ──────────────────────────────────────────
// Admin-only — all positions regardless of status.
export const getAllAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('executive_positions')
      .select(`
        *,
        holder:user_id ( id, full_name, profile_photo_url, year_level )
      `)
      .order('position_rank', { ascending: true });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch executive positions',
      });
    }

    const positions = data.map(p => ({
      ...p,
      holder_name: p.holder?.full_name || null,
      holder_photo_url: p.holder?.profile_photo_url || null,
      holder_year_level: p.holder?.year_level || null,
      holder: undefined,
    }));

    res.json({
      success: true,
      positions,
    });
  } catch (error) {
    console.error('Get all executive positions (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch executive positions',
    });
  }
};

// ─── POST /api/executive ──────────────────────────────────────────────────
// Admin-only — create a new position.
export const create = async (req, res) => {
  try {
    const {
      position_name, position_rank, user_id,
      academic_year, elected_at, term_start, term_end,
    } = req.body;

    if (!position_name) {
      return res.status(400).json({
        success: false,
        message: 'position_name is required',
      });
    }

    const { data, error } = await supabase
      .from('executive_positions')
      .insert({
        position_name,
        position_rank: position_rank || 0,
        user_id: user_id || null,
        academic_year,
        elected_at: elected_at || null,
        term_start: term_start || null,
        term_end: term_end || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create executive position',
      });
    }

    res.status(201).json({
      success: true,
      position: data,
    });
  } catch (error) {
    console.error('Create executive position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create executive position',
    });
  }
};

// ─── PUT /api/executive/:id ────────────────────────────────────────────────
// Admin-only — update a position.
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position_name, position_rank, user_id,
      academic_year, elected_at, term_start, term_end, status,
    } = req.body;

    const { data, error } = await supabase
      .from('executive_positions')
      .update({
        position_name,
        position_rank,
        user_id,
        academic_year,
        elected_at,
        term_start,
        term_end,
        status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update executive position',
      });
    }

    res.json({
      success: true,
      position: data,
    });
  } catch (error) {
    console.error('Update executive position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update executive position',
    });
  }
};

// ─── DELETE /api/executive/:id ─────────────────────────────────────────────
// Admin-only — delete a position.
export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('executive_positions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete executive position',
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete executive position error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete executive position',
    });
  }
};
