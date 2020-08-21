const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Log = require('../models/Log')

// @desc     Get all logs
// @route    GET /api/v1/logs
// @route    GET /api/v1/users/:userId/logs
// @access   Private, Admins
exports.getLogs = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults)
})
