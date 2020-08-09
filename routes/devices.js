const express = require('express')

const { getDevices, createDevice } = require('../controllers/devices')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

// prettier-ignore
router.route('/')
	.get(protect, authorize('user', 'admin', 'superadmin'), getDevices)
	.post(protect, authorize('admin', 'superadmin'), createDevice)

module.exports = router
