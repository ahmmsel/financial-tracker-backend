const passport = require('passport')
const bcrypt = require('bcryptjs')
const { GraphQLLocalStrategy } = require('graphql-passport')

const User = require('../models/user.model')

async function configurePassport() {
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id)
			done(null, user)
		} catch (error) {
			done(error)
		}
	})

	passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username })

				if (!user) {
					throw new Error('Invalid username or password!')
				}

				const validatePassword = await bcrypt.compare(password, user.password)

				if (!validatePassword) {
					throw new Error('Invalid username or password!')
				}

				return done(null, user)
			} catch (error) {
				done(error)
			}
		}),
	)
}

module.exports = configurePassport
