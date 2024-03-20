const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	paymentType: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
		enum: ['INCOME', 'EXPENSE', 'INVESTMENT'],
	},
	amount: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		deafult: 'Unknown',
	},
	date: {
		type: Date,
		required: true,
	},
})

const Transaction = mongoose.mdoel('Transaction', transactionSchema)

module.exports = Transaction
