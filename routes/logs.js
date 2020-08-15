const express = require('express')

const { getLogs } = require('../controllers/logs')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

// prettier-ignore
router.route('/')
	.get(protect, authorize('admin', 'superadmin'), getLogs)

module.exports = router
