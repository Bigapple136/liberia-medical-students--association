import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Check database connection
    const { error } = await supabase.from('users').select('count').limit(1);

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: error ? 'disconnected' : 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;