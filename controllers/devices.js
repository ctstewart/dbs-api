const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Device = require('../models/Device')

// @desc     Get all devices
// @route    GET /api/v1/devices
// @access   Private, Users & Admins
exports.getDevices = asyncHandler(async (req, res, next) => {
	let query

	// Copy req.query
	const reqQuery = { ...req.query }

	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit']

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param])

	// Create query string
	let queryStr = JSON.stringify(reqQuery)

	// Create operators ($gt, $gte, etc.)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	)

	// Finding resource
	query = Device.find(JSON.parse(queryStr))

	// Select Fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ')
		query = query.select(fields)
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ')
		query = query.sort(sortBy)
	} else {
		query = query.sort('manufacturer fullRetail')
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 25
	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Device.countDocuments(JSON.parse(queryStr))

	query = query.skip(startIndex).limit(limit)

	// Executing query
	const devices = await query

	// Pagination result
	const pagination = {}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		}
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		}
	}

	res.status(200).json({
		success: true,
		count: devices.length,
		pagination,
		data: devices,
	})
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

	if (!device) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.id}`,
				404
			)
		)
	}

	res.status(200).json({
		success: true,
		data: device,
	})
})
