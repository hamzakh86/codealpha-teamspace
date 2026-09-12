require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  isProd,
  port: process.env.PORT || 3030,
  dbURL: process.env.MONGODB_URL || 'mongodb+srv://khaledhamza251785_db_user:apySuxomqtEHIcnr@cluster0.vir6sj8.mongodb.net/?appName=Cluster0',
  dbName: process.env.DB_NAME || 'teamspace',
  jwtSecret: process.env.JWT_SECRET || 'collabflow-super-jwt-secret-2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'collabflow-refresh-secret-2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key',
  isGuestMode: true
}
