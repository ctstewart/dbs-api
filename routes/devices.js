const express = require('express')

const {
	getDevices,
	getDevice,
	createDevice,
	updateDevice,
} = require('../controllers/devices')

const Device = require('../models/Device')

const router = express.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

// prettier-ignore
router.route('/')
	.get(protect, advancedResults(Device), getDevices)
	.post(protect, authorize('admin', 'superadmin'), createDevice)

// prettier-ignore
router.route('/:id')
	.get(protect, getDevice)
	.put(protect, authorize('admin', 'superadmin'), updateDevice)

module.exports = router
