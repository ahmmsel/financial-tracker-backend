const bcrypt = require('bcryptjs')

const User = require('../models/user.model')

module.exports = {
	Query: {
		authUser: async (_, __, context) => {
			try {
				const user = await context.getUser()
				return user
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},
		user: async (_, { userId }) => {
			try {
				const user = await User.findOne(userId)
				return user
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},
	},
	Mutation: {
		signUp: async (_, { input }, context) => {
			try {
				const { username, name, password, gender } = input

				if (!username || !name || !password || !gender) {
					throw new Error('All Fields Are Required!')
				}

				const existingUser = await User.findOne({ username })

				if (existingUser) {
					throw new Error('username already taken')
				}

				const hashedPassword = await bcrypt.hash(password, 12)

				const boyOrGirl =
					gender === 'MALE' ? 'boy' : gender === 'FEMALE' && 'girl'

				const profilePicture = `https://avatar.iran.liara.run/public/${boyOrGirl}?username=${username}`

				const user = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture,
				})

				await user.save()
				await context.login(user)

				return user
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},

		login: async (_, { input }, context) => {
			try {
				const { username, password } = input
				const { user } = await context.authenticate('graphql-local', {
					username,
					password,
				})

				await context.login(user)

				return user
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},

		logout: async (_, __, context) => {
			try {
				await context.logout()
				req.session.destroy((error) => {
					if (error) throw error
				})

				res.clearCookie('connect.sid')

				return { message: 'Logged out successfully!' }
			} catch (error) {
				throw new Error(error.message || 'Internal server error')
			}
		},
	},
}
