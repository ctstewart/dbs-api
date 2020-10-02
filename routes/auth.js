const express = require('express')
const {
	login,
	getMe,
	logout,
	updatePassword,
	forgotPassword,
	resetPassword,
} = require('../controllers/auth')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/logout', protect, logout)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router
