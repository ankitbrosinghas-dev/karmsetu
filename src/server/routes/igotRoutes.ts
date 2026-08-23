import { Router } from 'express';
import { getIgotService } from '../../services/igot/igotService';
import { igotConfig } from '../../services/igot/igotConfig';

const router = Router();

// Endpoint to check connection status
router.get('/config', (req, res) => {
  res.json({
    isDemoMode: igotConfig.isDemoMode,
    isConfigured: igotConfig.validateConfig(),
    baseUrl: igotConfig.baseUrl
  });
});

router.get('/dashboard', async (req, res) => {
  try {
    const service = getIgotService();
    const stats = await service.getSyncDashboard();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const service = getIgotService();
    const logs = await service.getSyncLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:id/profile', async (req, res) => {
  try {
    const service = getIgotService();
    const profile = await service.getLearnerProfile(req.params.id);
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses/catalogue', async (req, res) => {
  try {
    const service = getIgotService();
    const catalogue = await service.getTrainingCatalogue();
    res.json(catalogue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/courses/recommend', async (req, res) => {
  try {
    const competency = req.query.competency as string;
    const service = getIgotService();
    // Hardcoded user id for demo
    const recommended = await service.getRecommendedTraining('user-1', competency);
    res.json(recommended);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
