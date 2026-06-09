"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/channels.ts
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// GET /api/channels
router.get('/', async (req, res) => {
    try {
        // Fetch all channels that are marked as active
        const channels = await db_1.prisma.channel.findMany({
            where: { isActive: true }
        });
        res.status(200).json(channels);
    }
    catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Internal server error while fetching channels' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.prisma.channel.delete({
            where: { id: String(id) }
        });
        res.status(200).json({ message: 'Channel deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ error: 'Internal server error while deleting channel' });
    }
});
exports.default = router;
