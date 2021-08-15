const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const cors = require('cors')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

// Route fjles
const devices = require('./routes/devices')
const auth = require('./routes/auth')
const logs = require('./routes/logs')
const users = require('./routes/users')

const app = express()

const corsOptions = {
	origin: process.env.CORS_ALLOWED,
	credentials: true,
}

app.use(cors(corsOptions))

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
} else if (process.env.NODE_ENV === 'production') {
	app.use(morgan('common'))
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 5000,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Mount routers
app.use('/api/v1/devices', devices)
app.use('/api/v1/auth', auth)
app.use('/api/v1/logs', logs)
app.use('/api/v1/users', users)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red)
	// Close server and exit process
	server.close(() => process.exit(1))
})
