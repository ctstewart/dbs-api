const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Log', LogSchema)
