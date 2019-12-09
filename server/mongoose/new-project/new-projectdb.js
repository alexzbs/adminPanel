import mongoose from 'mongoose';
require('dotenv').config()

mongoose.connect(
    process.env.DB_HOST,
    {
        useNewUrlParser: true,
        useFindAndModify: false
    },
);

const projectdb = mongoose.connection;
// console.log(projectdb);

projectdb.once('open', () => {
    console.log('GraphQL Server : MongoDB Project DataBase initial connection successful');
});

projectdb.on('error', (err) => {
    console.error('GraphQL Server : MongoDB Project DataBase connection error:', err);
});

projectdb.on('connected', () => {
    console.log('GraphQL Server : MongoDB Project DataBase connection is connected');
});

projectdb.on('disconnected', () => {
    console.log('ApolloServer: GraphQL Server: MongoDB Project DataBase connection is disconnected');
});

projectdb.on('close', () => {
    console.log('ApolloServer: MongoDB Project DataBase connection is close');
});

export default projectdb;
