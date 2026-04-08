const express = require('express');
const connectDB = require('./database/db');
// const auth = require('./middleware/auth');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;



// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./utils/session'));


// Routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);

// app.get('/',auth ,(req, res) => {
//     res.json({ message: `Welcome to the Blog API ${req.user.role}`, user: req.user });
// });

// Run Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));