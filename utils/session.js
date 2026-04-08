const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
require('dotenv').config();

// const sessionStore = new MongoDBStore({
//     uri: process.env.MONGO_URL,
//     collection: 'sessions'
// });

// sessionStore.on('error', function (error) {
//     console.log('Session Store Error:', error);
// });

const sessionMiddleware = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions'
}),
    cookie: {
        // secure: process.env.NODE_ENV === 'production',

        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
});

module.exports = sessionMiddleware;