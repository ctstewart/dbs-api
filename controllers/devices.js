const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Device = require('../models/Device')

// @desc     Get all devices
// @route    GET /api/v1/devices
// @access   Private, Users & Admins
exports.getDevices = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})

// @desc     Get single device
// @route    GET /api/v1/devices/:id
// @access   Private, Users & Admins
exports.getDevice = asyncHandler(async (req, res, next) => {
	const device = await Device.findById(req.params.id)

	if (!device) {
		return next(
			new ErrorResponse(
				`Resource not found with id ${req.params.id}`,
				404
			)
		)
	}

	res.status(200).json({
		success: true,
		data: device,
	})
})

// @desc     Create device
// @route    POST /api/v1/devices
// @access   Private, Admins
exports.createDevice = asyncHandler(async (req, res, next) => {
	const device = await Device.create(req.body)

	res.status(201).json({
		success: true,
		data: device,
	})
})

// @desc     Update device
// @route    PUT /api/v1/devices/:id
// @access   Private, Admins
exports.updateDevice = asyncHandler(async (req, res, next) => {
	const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: device,
	})
})

// @desc     Delete device
// @route    DELETE /api/v1/devices/:id
// @access   Private, Admins
exports.deleteDevice = asyncHandler(async (req, res, next) => {
	await Device.findByIdAndDelete(req.params.id)

	res.status(200).json({
		success: true,
		data: {},
	})
})
