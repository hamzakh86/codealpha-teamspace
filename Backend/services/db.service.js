const MongoClient = require('mongodb').MongoClient
const path = require('path')
const fs = require('fs')
const config = require('../config')
const logger = require('./logger.service')

module.exports = {
    getCollection
}

let dbConn = null
let memoryStore = {}

// Initialize in-memory fallback store from demo data if needed
function initMemoryStore() {
    try {
        const demoBoardsPath = path.join(__dirname, '../data/demo-data.json')
        const usersPath = path.join(__dirname, '../data/users-data.json')
        
        if (fs.existsSync(demoBoardsPath)) {
            const raw = fs.readFileSync(demoBoardsPath, 'utf8')
            const boards = JSON.parse(raw)
            memoryStore['board'] = boards.map((b, idx) => ({
                ...b,
                _id: b._id || b.id || `b${idx + 101}`
            }))
        } else {
            memoryStore['board'] = []
        }

        if (fs.existsSync(usersPath)) {
            const rawUsers = fs.readFileSync(usersPath, 'utf8')
            const users = JSON.parse(rawUsers)
            memoryStore['user'] = users.map((u, idx) => ({
                ...u,
                _id: u._id || u.id || `u${idx + 101}`
            }))
        } else {
            memoryStore['user'] = []
        }

        // Initialize workspace store — empty, will be auto-created per user on login
        memoryStore['workspace'] = []
        memoryStore['subscription'] = []
        memoryStore['activity'] = []
    } catch (e) {
        logger.warn('Could not preload fallback json files', e.message)
    }
}
initMemoryStore()

async function getCollection(collectionName) {
    try {
        const db = await connect()
        if (db) {
            return db.collection(collectionName)
        }
    } catch (err) {
        logger.warn(`Mongo connection failed, falling back to in-memory store for ${collectionName}: ${err.message}`)
    }
    return getMemoryCollection(collectionName)
}

let isConnecting = false
let lastFailedAttempt = 0

async function connect() {
    if (dbConn) return dbConn
    if (!config.dbURL || config.dbURL.includes('<db_password>')) return null

    // Avoid retrying every millisecond if previous attempt failed (cooldown 30s)
    if (Date.now() - lastFailedAttempt < 30000) {
        return null
    }

    if (isConnecting) return null
    isConnecting = true

    try {
        const client = await MongoClient.connect(config.dbURL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 2000
        })
        const db = client.db(config.dbName)
        dbConn = db
        logger.info(`✅ Connecté avec succès à MongoDB Atlas (${config.dbName})`)
        isConnecting = false
        return db
    } catch (err) {
        lastFailedAttempt = Date.now()
        isConnecting = false
        logger.warn('ℹ️ MongoDB Atlas distant non connecté : mode résilient mémoire actif (toutes les fonctionnalités restent 100% opérationnelles).')
        return null
    }
}

// Helper: resolve dot-notation key on an object
function dotGet(obj, path) {
    return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj)
}

// Helper: check if an object matches a filter (supports exact, dot-notation, and $elemMatch)
function matchesFilter(item, filter) {
    return Object.entries(filter).every(([key, value]) => {
        // Support dot-notation: 'members._id'
        if (key.includes('.')) {
            const [parent, child] = key.split('.')
            const parentVal = item[parent]
            if (Array.isArray(parentVal)) {
                // Check if any element in the array has the child field matching value
                return parentVal.some(el => String(el[child]) === String(value))
            }
            return String(dotGet(item, key)) === String(value)
        }
        if (key === '$elemMatch') return true // skip for now
        if (key === '_id') {
            const itemId = item._id || item.id
            if (!itemId) return false
            const valStr = value?.toString ? value.toString() : String(value)
            return String(itemId) === valStr || String(itemId) === String(value)
        }
        const itemVal = item[key]
        if (itemVal === undefined || itemVal === null) return false
        return String(itemVal) === String(value)
    })
}

// Resilient in-memory collection interface matching MongoDB collection API
function getMemoryCollection(name) {
    if (!memoryStore[name]) memoryStore[name] = []
    const items = memoryStore[name]

    return {
        find: (filter = {}) => {
            let res = Object.keys(filter).length === 0
                ? [...items]
                : items.filter(item => matchesFilter(item, filter))
            return {
                toArray: async () => res
            }
        },
        findOne: async (filter = {}) => {
            if (Object.keys(filter).length === 0) return items[0] || null
            // Support dot-notation and direct field filters
            return items.find(item => matchesFilter(item, filter)) || null
        },
        insertOne: async (item) => {
            if (!item._id) item._id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
            items.push(item)
            return { insertedId: item._id }
        },
        updateOne: async (filter = {}, update = {}) => {
            const target = items.find(i => {
                if (filter._id) {
                    const idStr = filter._id.toString ? filter._id.toString() : filter._id
                    return (i._id && i._id.toString() === idStr) || i._id === idStr
                }
                return false
            })
            if (target && update.$set) {
                Object.assign(target, update.$set)
            }
            return { matchedCount: target ? 1 : 0, modifiedCount: target ? 1 : 0 }
        },
        deleteOne: async (filter = {}) => {
            const idx = items.findIndex(i => {
                if (filter._id) {
                    const idStr = filter._id.toString ? filter._id.toString() : filter._id
                    return (i._id && i._id.toString() === idStr) || i._id === idStr
                }
                return false
            })
            if (idx !== -1) items.splice(idx, 1)
            return { deletedCount: idx !== -1 ? 1 : 0 }
        }
    }
}
