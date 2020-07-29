const express = require('express')
const { login, getMe, updatePassword } = require('../controllers/auth')

const router = express.Router()

const { protect } = require('../middleware/auth')

router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatepassword', protect, updatePassword)

module.exports = router
