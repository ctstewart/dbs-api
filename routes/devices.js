const express = require('express')

const {
	getDevices,
	getDevice,
	createDevice,
	updateDevice,
	deleteDevice,
} = require('../controllers/devices')

const Device = require('../models/Device')

const router = express.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

// prettier-ignore
router.route('/')
	.get(advancedResults(Device), getDevices)
	.post(authorize('admin', 'superadmin'), createDevice)

// prettier-ignore
router.route('/:id')
	.get(getDevice)
	.put(authorize('admin', 'superadmin'), updateDevice)
	.delete(authorize('admin', 'superadmin'), deleteDevice)

module.exports = router
