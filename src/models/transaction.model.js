const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
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
	},
	{
		timestamps: true,
	},
)

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
