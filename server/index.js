import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { importSchema } from 'graphql-import'
import resolvers from './graphql/resolvers'
import fs from 'fs'
import https from 'https'
import http from 'http'
import jwt from "jsonwebtoken";
require('dotenv').config()

const typeDefs = importSchema('./graphql/schema.graphql')

function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 4000, hostname: 'localhost' }
}

const environment = process.env.NODE_ENV || 'production'

const config = configurations[environment]

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => {
        const token =  req && req.headers.authorization && req.headers.authorization.split(" ")[1] 
        if (!connection && token) {
            return validateToken(token);
        }
        return { token: { email: "undefined" }, role: process.env.GUEST_ROLE };
    },
    subscriptions: {
    /*     onConnect: (connectionParams, webSocket) => {
            if (connectionParams.authToken) {
                return validateToken(connectionParams.authToken);
            } else {
                throw new Error("Missing auth token!");

            }
        } */
    }
})

const app = express()
apollo.applyMiddleware({ app })


// Create the HTTPS or HTTP server, per configuration
var server
if (config.ssl) {
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer(
        {
            key: fs.readFileSync('./ssl/key.pem'),
            cert: fs.readFileSync('./ssl/cert.pem'),
            passphrase: 'trlAvR4c472tfF5AyNxy',
        },
        app,
    );
} else {
    server = http.createServer(app)
}

// Add subscription support
apollo.installSubscriptionHandlers(server)

server.listen({ port: config.port }, () => {
    console.log(
        '🚀 Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
    )
    console.log(`🚀 Subscriptions ready at ws://localhost:${config.port}${apollo.subscriptionsPath}`)
})

