const express = require('express')

const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/users')

const User = require('../models/User')

const router = express.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin', 'superadmin'))

// prettier-ignore
router.route('/')
	.get(advancedResults(User), getUsers)
	.post(createUser)

// prettier-ignore
router.route('/:id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser)

module.exports = router
