const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/User')

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private, Admins
exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @desc     Get user
// @route    GET /api/v1/users/:id
// @access   Private, Admins
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc     Create user
// @route    POST /api/v1/users
// @access   Private, Admins
exports.createUser = asyncHandler(async (req, res, next) => {
	const { firstName, lastName, email, store, district, password } = req.body

	const forceNewPassword = true

	const user = await User.create({
		firstName,
		lastName,
		email,
		store,
		district,
		password,
		forceNewPassword
	})

	res.status(201).json({
		success: true,
		data: user,
	})
})

// @desc     Update user
// @route    PUT /api/v1/users/:id
// @access   Private, Admins
exports.updateUser = asyncHandler(async (req, res, next) => {
	let user = await User.findById(req.params.id)

	if (user.role === 'superadmin') {
		return next(new ErrorResponse('Superadmins cannot be updated', 403))
	}

	if (user.role === 'admin' && req.user.role !== 'superadmin') {
		return next(
			new ErrorResponse('Only superadmins can update admins', 403)
		)
	}

	const fieldsToUpdate = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		store: req.body.store,
		district: req.body.district,
	}

	user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: user,
	})
})

// @desc     Delete user
// @route    DELETE /api/v1/users/:id
// @access   Private, Admins
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	if (user.role === 'superadmin') {
		return next(new ErrorResponse('Superadmins cannot be deleted', 403))
	}

	if (user.role === 'admin' && req.user.role !== 'superadmin') {
		return next(
			new ErrorResponse('Only superadmins can delete admins', 403)
		)
	}

	await User.findByIdAndDelete(req.params.id)

	res.status(200).json({
		success: true,
		data: {},
	})
})
