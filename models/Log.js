const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: [true, 'Please add a category'],
			enum: ['login'],
		},
		user: {
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
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Log', LogSchema)
