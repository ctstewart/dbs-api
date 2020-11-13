const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/User')
const Log = require('../models/Log')

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

	if (user.role === 'user') {
		await Log.create({ category: 'login', user: user.id })
	}

	sendTokenResponse(user, 200, res)
})

// @desc     Get current logged in user details
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
	// user is already available in req due to the protect middleware
	const user = req.user

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc     Logout user / clear cookie
// @route    GET /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	})

	res.status(200).json({
		success: true,
		data: {},
	})
})

// @desc     Update password
// @route    PUT /api/v1/auth/updatepassword
// @access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')

	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse('Password is incorrect', 401))
	}

	user.password = req.body.newPassword

	if (user.forceNewPassword) {
		user.forceNewPassword = false
	}

	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc     Forgot password
// @route    POST /api/v1/auth/forgotpassword
// @access   Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })

	if (!user) {
		console.log('Forgot password route requires a valid user')
		return res.status(200).json({
			success: true,
			data:
				'If the provided email address exists in our database, we send instructions to it so you can reset your password.',
		})
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken()

	await user.save({ validateBeforeSave: false })

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get('host')}/#/resetPassword/${resetToken}`
	// const resetUrl = `${req.protocol}://${req.get(
	// 	'host'
	// )}/api/v1/auth/resetpassword/${resetToken}`

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please follow this link: \n\n ${resetUrl} \n\n If you did not request this change, please contact your manager.`

	try {
		await sendEmail({
			email: user.email,
			subject: 'Password Reset',
			message,
		})
		res.status(200).json({
			success: true,
			data:
				'If the provided email address exists in our database, we send instructions to it so you can reset your password.',
		})
	} catch (err) {
		console.error(err)
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		return next(new ErrorResponse('Email could not be sent', 500))
	}
})

// @desc     Reset password
// @desc     PUT /api/v1/auth/resetpassword/:resettoken
// @access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex')

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(new ErrorResponse('Invalid token', 400))
	}

	// Set new password
	user.password = req.body.password
	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined
	await user.save()

	sendTokenResponse(user, 200, res)
})

// Methods
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken()

	const options = {
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		httpOnly: true,
	}

	if (process.env.NODE_ENV === 'production') {
		options.secure = true
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		data: {},
	})
}
