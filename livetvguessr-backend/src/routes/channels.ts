// src/routes/channels.ts
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /api/channels
router.get('/', async (req, res) => {
    try {
        // Fetch all channels that are marked as active
        const channels = await prisma.channel.findMany({
            where: { isActive: true }
        });
        
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Internal server error while fetching channels' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.channel.delete({
            where: { id: String(id) }
        });
        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ error: 'Internal server error while deleting channel' });
    }
});
export default router;