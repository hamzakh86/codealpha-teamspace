const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')

// Seed initial messages for PolySpace EPS channels
const channelMessages = {
    'polyoverflow': [
        {
            _id: 'cmsg_seed_ov_1',
            channel: 'polyoverflow',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Bienvenue sur PolyOverflow ! Cet espace est dédié à vos questions de programmation (C, Python, Java), algorithmique, mathématiques et électronique. N'hésitez pas à poser vos questions !",
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            isPinned: true,
            reactions: { '👍': ['Hamza Khaled (Manager)', 'Youssef Trabelsi (Prépa 2)'], '🎓': ['Nour Ben Salem (GL3)'] }
        },
        {
            _id: 'cmsg_seed_ov_2',
            channel: 'polyoverflow',
            from: 'Youssef Trabelsi (Prépa 2)',
            fromId: 'u102',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youssef',
            txt: "Salut tout le monde ! Quelqu'un a un exemple d'implémentation d'arbre binaire de recherche en C pour le TP d'algo ?",
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            reactions: { '💡': ['Hamza Khaled (Manager)'] }
        },
        {
            _id: 'cmsg_seed_ov_3',
            channel: 'polyoverflow',
            from: 'Nour Ben Salem (GL3)',
            fromId: 'u103',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nour',
            txt: "Regarde sur le PolyDrive dans la section 'Algo & Structures de données', il y a tous les codes des TD corrigés avec les schémas mémoires !",
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
            attachment: {
                name: 'TD3_Arbres_Binaires_Corrigé_EPS.pdf',
                size: '1.4 Mo',
                type: 'pdf'
            },
            reactions: { '❤️': ['Youssef Trabelsi (Prépa 2)'], '🚀': ['Hamza Khaled (Manager)'] }
        }
    ],
    'polystages-pfe': [
        {
            _id: 'cmsg_seed_st_1',
            channel: 'polystages-pfe',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Bienvenue sur PolyStages & PFE ! Vous trouverez ici des offres de stages d'été, PFA et PFE vérifiées auprès de nos entreprises partenaires à Sousse (Novation City, Technopôle) et à l'international.",
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
            isPinned: true,
            reactions: { '🚀': ['Aziz Ghariani (Club Robotique)', 'Nour Ben Salem (GL3)'], '🔥': ['Hamza Khaled (Manager)'] }
        },
        {
            _id: 'cmsg_seed_st_2',
            channel: 'polystages-pfe',
            from: 'Aziz Ghariani (Club Robotique)',
            fromId: 'u104',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aziz',
            txt: "Offre PFE reçue : Startup IoT à Novation City cherche stagiaire développement embarqué STM32 / FreeRTOS. Envoyez vos CV !",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            attachment: {
                name: 'Offre_PFE_IoT_NovationCity_2026.pdf',
                size: '520 Ko',
                type: 'pdf'
            },
            reactions: { '🔥': ['Hamza Khaled (Manager)'], '👍': ['Nour Ben Salem (GL3)'] }
        }
    ],
    'polyfreelance': [
        {
            _id: 'cmsg_seed_fl_1',
            channel: 'polyfreelance',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Bienvenue sur PolyFreelance ! Cet espace permet aux étudiants de trouver des missions rémunérées (développement web, mobile, UI/UX, électronique).",
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            isPinned: true
        },
        {
            _id: 'cmsg_seed_fl_2',
            channel: 'polyfreelance',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Mission freelance disponible : Refonte du site web d'un cabinet médical à Sousse (React / Tailwind). Budget : 700 TND. Me contacter en privé.",
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
            reactions: { '🚀': ['Nour Ben Salem (GL3)'], '💰': ['Youssef Trabelsi (Prépa 2)'] }
        }
    ],
    'polydrive-examens': [
        {
            _id: 'cmsg_seed_dr_1',
            channel: 'polydrive-examens',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Bienvenue sur PolyDrive & Examens ! Banque collaborative d'annales de devoirs surveillés (DS), examens semestriels et résumés de cours pour prépa et cycle ingénieur.",
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            isPinned: true,
            reactions: { '🎓': ['Hamza Khaled (Manager)', 'Youssef Trabelsi (Prépa 2)'], '⭐': ['Nour Ben Salem (GL3)'] }
        },
        {
            _id: 'cmsg_seed_dr_2',
            channel: 'polydrive-examens',
            from: 'Youssef Trabelsi (Prépa 2)',
            fromId: 'u102',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=youssef',
            txt: "Annales DS Algèbre Linéaire & Analyse 2 (sessions 2022 à 2024 avec corrigés détaillés) ajoutées dans les ressources. Bonnes révisions !",
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            attachment: {
                name: 'DS_Algebre_et_Analyse_2022_2024.pdf',
                size: '3.1 Mo',
                type: 'pdf'
            },
            reactions: { '❤️': ['Hamza Khaled (Manager)', 'Nour Ben Salem (GL3)'], '🔥': ['Aziz Ghariani (Club Robotique)'] }
        }
    ],
    'vie-du-campus': [
        {
            _id: 'cmsg_seed_vc_1',
            channel: 'vie-du-campus',
            from: 'Hamza Khaled (Manager)',
            fromId: 'u101',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamza',
            txt: "Bienvenue sur Vie du Campus ! Événements, compétitions, hackathons et vie associative de l'École Polytechnique de Sousse.",
            timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
            isPinned: true
        },
        {
            _id: 'cmsg_seed_vc_2',
            channel: 'vie-du-campus',
            from: 'Aziz Ghariani (Club Robotique)',
            fromId: 'u104',
            imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aziz',
            txt: "Rappel : Première réunion du Club Robotique EPS ce mercredi à 14h au laboratoire d'électronique. Tous les étudiants (prépa et ingénieurs) sont les bienvenus !",
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            reactions: { '🤖': ['Hamza Khaled (Manager)', 'Youssef Trabelsi (Prépa 2)'], '🚀': ['Nour Ben Salem (GL3)'] }
        }
    ]
}

let isSeeded = false
async function _ensureSeed(collection) {
    if (isSeeded) return
    try {
        for (const ch of Object.keys(channelMessages)) {
            const existing = await collection.find({ channel: ch }).toArray()
            if (!existing || existing.length === 0) {
                for (const seedMsg of channelMessages[ch]) {
                    await collection.insertOne({ ...seedMsg })
                }
            }
        }
        isSeeded = true
    } catch (e) {
        // ignore seed errors
    }
}

async function getMessages(channelName, limit = 50) {
    try {
        const collection = await dbService.getCollection('channel_messages')
        await _ensureSeed(collection)
        const msgs = await collection
            .find({ channel: channelName })
            .sort({ timestamp: 1 })
            .limit(limit)
            .toArray()
        if (msgs && msgs.length > 0) return msgs
        return channelMessages[channelName] || []
    } catch (err) {
        // Fallback to in-memory if DB fails
        logger.warn(`channel_messages DB fallback for #${channelName}: ${err.message}`)
        return channelMessages[channelName] || []
    }
}

async function addMessage(channelName, msg) {
    const message = {
        _id: 'cmsg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        channel: channelName,
        from: msg.from || 'Anonyme',
        fromId: msg.fromId || null,
        imgUrl: msg.imgUrl || '',
        txt: msg.txt,
        timestamp: new Date().toISOString(),
        reactions: msg.reactions || {},
        isPinned: !!msg.isPinned,
        attachment: msg.attachment || null
    }

    if (!channelMessages[channelName]) channelMessages[channelName] = []
    channelMessages[channelName].push(message)

    try {
        const collection = await dbService.getCollection('channel_messages')
        await collection.insertOne(message)
    } catch (err) {
        logger.warn(`channel_messages in-memory fallback for #${channelName}: ${err.message}`)
    }

    return message
}

async function toggleReaction(channelName, msgId, emoji, userIdentifier) {
    const fallbackList = channelMessages[channelName] || []
    let updatedMsg = null

    // Update in-memory
    const memoryMsg = fallbackList.find(m => m._id === msgId)
    if (memoryMsg) {
        if (!memoryMsg.reactions) memoryMsg.reactions = {}
        const users = memoryMsg.reactions[emoji] || []
        const userIdx = users.indexOf(userIdentifier)
        if (userIdx !== -1) {
            users.splice(userIdx, 1)
            if (users.length === 0) delete memoryMsg.reactions[emoji]
            else memoryMsg.reactions[emoji] = users
        } else {
            users.push(userIdentifier)
            memoryMsg.reactions[emoji] = users
        }
        updatedMsg = memoryMsg
    }

    // Update Mongo DB if collection exists
    try {
        const collection = await dbService.getCollection('channel_messages')
        const dbMsg = await collection.findOne({ _id: msgId })
        if (dbMsg) {
            if (!dbMsg.reactions) dbMsg.reactions = {}
            const users = dbMsg.reactions[emoji] || []
            const userIdx = users.indexOf(userIdentifier)
            if (userIdx !== -1) {
                users.splice(userIdx, 1)
                if (users.length === 0) delete dbMsg.reactions[emoji]
                else dbMsg.reactions[emoji] = users
            } else {
                users.push(userIdentifier)
                dbMsg.reactions[emoji] = users
            }
            await collection.updateOne({ _id: msgId }, { $set: { reactions: dbMsg.reactions } })
            updatedMsg = dbMsg
        }
    } catch (err) {
        logger.warn(`toggleReaction DB error: ${err.message}`)
    }

    return updatedMsg
}

async function togglePin(channelName, msgId) {
    const fallbackList = channelMessages[channelName] || []
    let updatedMsg = null

    // Update in-memory
    const memoryMsg = fallbackList.find(m => m._id === msgId)
    if (memoryMsg) {
        memoryMsg.isPinned = !memoryMsg.isPinned
        updatedMsg = memoryMsg
    }

    // Update Mongo DB
    try {
        const collection = await dbService.getCollection('channel_messages')
        const dbMsg = await collection.findOne({ _id: msgId })
        if (dbMsg) {
            dbMsg.isPinned = !dbMsg.isPinned
            await collection.updateOne({ _id: msgId }, { $set: { isPinned: dbMsg.isPinned } })
            updatedMsg = dbMsg
        }
    } catch (err) {
        logger.warn(`togglePin DB error: ${err.message}`)
    }

    return updatedMsg
}

module.exports = { getMessages, addMessage, toggleReaction, togglePin }
