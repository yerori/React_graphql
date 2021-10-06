import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import resolvers from './graphql/resolvers/index.js';
import { typeDefs } from './graphql/typeDefs.js';

const app = express();
const __dirname = path.resolve();
const envPath = path.join(__dirname, "./.env");

dotenv.config({ path: envPath });

const { PORT, MONGODB } = process.env;


const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(`${MONGODB}`, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen(`${PORT}`);
    }).then(res => {
        console.log(`Server running at ${res.url}`)
    })

