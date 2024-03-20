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
const connectMongoDB = require('./db/mongodb')
require('dotenv').config()

const typeDefs = loadFilesSync(path.join(__dirname, 'schemas/**/*.graphql'))
const resolvers = loadFilesSync(
	path.join(__dirname, 'resolvers/**/*.resolver.js'),
)

async function bootstrap() {
	const app = express()

	const httpServer = http.createServer(app)

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})

	await server.start()

	app.use(
		'/',
		cors(),
		express.json(),
		expressMiddleware(server, {
			context: async (req) => ({ req }),
		}),
	)

	await new Promise((resolve) =>
		httpServer.listen({ port: process.env.PORT }, resolve),
	)

	await connectMongoDB()

	console.log(`🚀  Server ready at: localhost://${process.env.PORT}`)
}

bootstrap()
