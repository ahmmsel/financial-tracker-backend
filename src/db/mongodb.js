const mongoose = require('mongoose')

async function connectMongoDB() {
	try {
		const { connection } = await mongoose.connect(process.env.DATABASE_URL)
		console.log(`MongoDB Connected at ${connection.host}`)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

module.exports = connectMongoDB
