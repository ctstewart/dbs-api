const mongoose = require('mongoose')
const slugify = require('slugify')

const DeviceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please add the device's name"],
			unique: true,
			trim: true,
			maxlength: [
				100,
				"The device's name cannot be more than 100 characters",
			],
		},
		slug: String,
		manufacturer: {
			type: String,
			required: [true, 'Please add the manufacturer'],
			enum: [
				'Apple',
				'Samsung',
				'Verizon',
				'Motorola',
				'LG',
				'Kyocera',
				'Alcatel',
				'Google',
			],
		},
		fullRetail: {
			type: Number,
			required: [true, 'Please add the full retail price'],
		},
		storageCapacity: {
			type: String,
			enum: ['N/A', '16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
			required: [true, 'Please add the storage capacity']
		},
		category: {
			type: String,
			enum: ['Phone', 'Tablet', 'Smartwatch', 'Other']
		}
	},
	{
		timestamps: true,
	}
)

DeviceSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true })
	next()
})

module.exports = mongoose.model('Device', DeviceSchema)
