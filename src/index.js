const { ApolloServer } = require('@apollo/server')
const {
	ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@apollo/server/express4')
const { loadFilesSync } = require('@graphql-tools/load-files')
const path = require('path')
const express = require('express')
const http = require('http')
const cors = require('cors')
const session = require('express-session')
const connectMongo = require('connect-mongodb-session')
const connectMongoDB = require('./db/mongodb')
const passport = require('passport')
const { buildContext } = require('graphql-passport')
const configurePassport = require('./config/passport.config')

require('dotenv').config()
// Call passport configuration
configurePassport()

const typeDefs = loadFilesSync(path.join(__dirname, 'schemas/**/*.graphql'))
const resolvers = loadFilesSync(
	path.join(__dirname, 'resolvers/**/*.resolver.js'),
)

async function bootstrap() {
	const app = express()

	const httpServer = http.createServer(app)

	const MongoDBStore = connectMongo(session)

	const store = new MongoDBStore({
		uri: process.env.DATABASE_URL,
		collection: 'sessions',
	})

	store.on('error', (error) => console.error(error))

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				expires: 1000 * 60 * 60 * 24 * 7,
				httpOnly: true,
			},
			store,
		}),
	)

	app.use(passport.initialize())

	app.use(passport.session())

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})

	await server.start()

	app.use(
		'/',
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
		}),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req, res }) => buildContext({ req, res }),
		}),
	)

	await new Promise((resolve) =>
		httpServer.listen({ port: process.env.PORT }, resolve),
	)

	await connectMongoDB()

	console.log(`🚀  Server ready at: localhost://${process.env.PORT}`)
}

bootstrap()
