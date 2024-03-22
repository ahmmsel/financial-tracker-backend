const Transaction = require('../models/transaction.model')

module.exports = {
	Query: {
		transactions: async (_, __, context) => {
			try {
				const currentUser = await context.getUser()

				if (!currentUser) {
					throw new Error('Unauthorized!')
				}

				const currentUserTransactions = await Transaction.find({
					userId: currentUser._id,
				})

				return currentUserTransactions
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},

		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId)

				return transaction
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},
	},
	Mutation: {
		createTransaction: async (_, { input }, context) => {
			try {
				const transaction = new Transaction({
					...input,
					userId: context.getUser()._id,
				})

				await transaction.save()

				return transaction
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},

		updateTransaction: async (_, { input }, context) => {
			try {
				const currentUserId = await context.getUser()._id

				const transaction = await Transaction.findById(input.transactionId)

				if (transaction.userId !== currentUserId) {
					throw new Error('Cannot perform this action')
				}

				await transaction.update(input, { new: true })
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},

		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction =
					await Transaction.findByIdAndDelete(transactionId)

				return deletedTransaction
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},
	},
}
