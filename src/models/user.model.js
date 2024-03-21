const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ['MALE', 'FEMALE'],
		},
	},
	{ timestamps: true },
)

const User = mongoose.model('User', userSchema)

module.exports = User
