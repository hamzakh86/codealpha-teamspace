const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const config = require('./config')
const logger = require('./services/logger.service')

const app = express()
const http = require('http').createServer(app)

// Express Middlewares
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: (origin, callback) => {
        // Allow all local development origins (localhost, 127.0.0.1, 192.168.x.x, etc.)
        callback(null, true)
    },
    credentials: true,
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Async Local Storage Setup
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

// API Routes
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const workspaceRoutes = require('./api/workspace/workspace.routes')
const boardRoutes = require('./api/board/board.routes')
const subscriptionRoutes = require('./api/subscription/subscription.routes')
const channelRoutes = require('./api/channel/channel.routes')
const { setupSocketAPI } = require('./services/socket.service')

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/workspace', workspaceRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/channel', channelRoutes)

// Setup WebSockets
setupSocketAPI(http)

// Production static assets
if (config.isProd) {
    app.use(express.static(path.resolve(__dirname, 'public')))
    app.get('/**', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
}

const port = config.port || 3030
// Server start
http.listen(port, () => {
    logger.info(`🚀 CollabFlow Backend Server is running on port: ${port}`)
})
