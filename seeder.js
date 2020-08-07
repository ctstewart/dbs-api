require('dotenv').config({ path: './config/config.env' })
const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')

// Load models
const Device = require('./models/Device')
const User = require('./models/User')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
})

// Read JSON files
const devices = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/devices.json`, 'utf-8')
)

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

// Import into DB
const importData = async () => {
	try {
		await Device.create(devices)
		await User.create(users)
		console.log('Data Imported...'.green.inverse)
		process.exit()
	} catch (err) {
		console.error(err)
	}
}

const deleteData = async () => {
	try {
		await Device.deleteMany()
		await User.create(users)
		console.log('Data Destroyed...'.red.inverse)
		process.exit()
	} catch (err) {
		console.error(err)
	}
}

if (process.argv[2] === '-i') {
	importData()
} else if (process.argv[2] === '-d') {
	deleteData()
}
