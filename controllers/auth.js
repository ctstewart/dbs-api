const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body

	// Validate email & password
	if (!email || !password) {
		return next(
			new ErrorResponse('Please provide an email and password', 400)
		)
	}

	// Check for user
	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401))
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password)

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 401))
	}

	sendTokenResponse(user, 200, res)
})

// @desc     Get current logged in user details
// @route    GET /api/v1/auth/me
// @access   Private, Users and Admins
exports.getMe = asyncHandler(async (req, res, next) => {
	// user is already available in req
	// due to the protect middleware
	const user = req.user

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc     Update password
// @route    PUT /api/v1/auth/updatepassword
// @access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')

	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(ErrorResponse('Password is incorrect', 401))
	}

	user.password = req.body.newPassword

	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc     Forgot password
// @route    POST /api/v1/auth/forgotpassword
// @access   Private
// exports.forgotPassword = asyncHandler(async (req, res, next) => {
// 	const user = await User.findOne({ email: req.body.email })
// })

// Methods
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken()

	res.status(statusCode).json({
		success: true,
		token,
	})
}
