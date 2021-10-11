import { ApolloServer, PubSub } from 'apollo-server-express';
import { mongoose } from "@typegoose/typegoose";
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';

const app = express();

const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

const { PORT, MONGODB } = process.env;

const pubsub = new PubSub();

mongoose
    //URI에 연결
    .connect(`${MONGODB}`)
    .then(async () => {
        console.log('Successfully connected to mongodb');

        // 서버 정의
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({ req, pubsub })
        });

        // 서버 시작
        await server.start();

        // express가 미들웨어라는 것을 정의
        // cors : true로, playground에서 테스트 가능
        server.applyMiddleware({
            app,
            cors: true
        });

        // 서버가 가동하기 시작하면~
        app.listen(`${PORT}`, () => {
            console.log(`server is running on ${PORT}`);
        });
    })
