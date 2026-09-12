const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const channelService = require('./channel.service')
const logger = require('../../services/logger.service')

// GET /api/channel/:channelName/messages — load history (open to all students)
router.get('/:channelName/messages', async (req, res) => {
    try {
        const { channelName } = req.params
        const limit = parseInt(req.query.limit) || 50
        const messages = await channelService.getMessages(channelName, limit)
        res.json(messages)
    } catch (err) {
        logger.error('Failed to get channel messages', err)
        res.status(500).json({ error: 'Failed to load messages' })
    }
})

// POST /api/channel/:channelName/messages — post a message
router.post('/:channelName/messages', async (req, res) => {
    try {
        const { channelName } = req.params
        const loggedinUser = req.loggedinUser || {}
        const { txt, from, imgUrl } = req.body
        if (!txt || !txt.trim()) return res.status(400).json({ error: 'Message cannot be empty' })

        const msg = await channelService.addMessage(channelName, {
            from: from || loggedinUser.fullname || loggedinUser.username || 'Étudiant EPS',
            fromId: loggedinUser._id ? String(loggedinUser._id) : null,
            imgUrl: imgUrl || loggedinUser.imgUrl || '',
            txt: txt.trim()
        })
        res.status(201).json(msg)
    } catch (err) {
        logger.error('Failed to post channel message', err)
        res.status(500).json({ error: 'Failed to post message' })
    }
})

// POST /api/channel/:channelName/messages/:msgId/reaction — toggle emoji reaction
router.post('/:channelName/messages/:msgId/reaction', async (req, res) => {
    try {
        const { channelName, msgId } = req.params
        const { emoji, user } = req.body
        const userIdentifier = user || (req.loggedinUser && req.loggedinUser.fullname) || 'Étudiant EPS'
        if (!emoji) return res.status(400).json({ error: 'Emoji is required' })

        const updated = await channelService.toggleReaction(channelName, msgId, emoji, userIdentifier)
        res.json(updated)
    } catch (err) {
        logger.error('Failed to toggle reaction', err)
        res.status(500).json({ error: 'Failed to toggle reaction' })
    }
})

// POST /api/channel/:channelName/messages/:msgId/pin — toggle pinned state
router.post('/:channelName/messages/:msgId/pin', async (req, res) => {
    try {
        const { channelName, msgId } = req.params
        const updated = await channelService.togglePin(channelName, msgId)
        res.json(updated)
    } catch (err) {
        logger.error('Failed to toggle pin', err)
        res.status(500).json({ error: 'Failed to toggle pin' })
    }
})

module.exports = router

