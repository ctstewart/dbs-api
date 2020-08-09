const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Device = require('../models/Device')

// @desc     Get all devices
// @route    GET /api/v1/devices
// @access   Private, Users, Admins
exports.getDevices = asyncHandler(async (req, res, next) => {
	let query

	let queryStr = JSON.stringify(req.query)

	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	)

	query = Device.find(JSON.parse(queryStr))

	const devices = await query

	res.status(200).json({
		success: true,
		count: devices.length,
		data: devices,
	})
})

exports.createDevice = asyncHandler(async (req, res, next) => {
	const device = await Device.create(req.body)

	res.status(201).json({
		success: true,
		data: device,
	})
})
