const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

const authConfig = require('../auth_config.json')

// Protect routes
exports.protect = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
	}),

	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithms: ['RS256'],
})

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		console.log(req.user)
		const role = req.user.permissions[0]
		if (!roles.includes(role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			)
		}

		next()
	}
}
