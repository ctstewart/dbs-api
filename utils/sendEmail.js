const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
	const transportFunction = () => {
		if (process.env.NODE_ENV === 'production') {
			return nodemailer.createTransport({
				service: process.env.SMTP_SERVICE,
				auth: {
					user: process.env.SMTP_EMAIL,
					pass: process.env.SMTP_PASSWORD,
				},
			})
		} else {
			return nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				auth: {
					user: process.env.SMTP_EMAIL,
					pass: process.env.SMTP_PASSWORD,
				},
			})
		}
	}

	const transporter = transportFunction()

	// send mail with defined transport object
	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}

	const info = await transporter.sendMail(message)

	console.log(`Message sent: ${info.messageId}`)
}

module.exports = sendEmail
