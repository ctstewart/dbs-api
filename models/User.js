const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please add a first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please add a last name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		role: {
			type: String,
			enum: ['user', 'admin', 'superadmin'],
			default: 'user',
		},
		store: {
			type: String,
			required: [true, 'Please include the store'],
		},
		district: {
			type: String,
			required: [true, 'Please include the district'],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
			select: false,
		},
		forceNewPassword: {
			type: Boolean,
			default: false
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
)

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	const now = new Date()

	let midnight = new Date()
	midnight.setDate(now.getDate() + 1)
	midnight.setHours(0, 0, 0, 0)

	msToMidnight = midnight.getTime() - now.getTime()

	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: msToMidnight,
	})
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex')

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

	return resetToken
}

UserSchema.pre('remove', async function (next) {
	await this.model('Log').deleteMany({ user: this._id })
})

module.exports = mongoose.model('User', UserSchema)
