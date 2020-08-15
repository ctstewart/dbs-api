const mongoose = require('mongoose')

const LoginLogSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: [true, 'Please add a category'],
			enum: ['login'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('LoginLog', LoginLogSchema)
