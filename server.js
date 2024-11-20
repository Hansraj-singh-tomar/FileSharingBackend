require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
connectDB();

// Cors Configuration
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS,
    // origin: process.env.ALLOWED_CLIENTS.split(","),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOptions));

app.use(express.json());

// static files
app.use(express.static('public'));

// template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// make api request

// routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});


// http://localhost:3000/api/files
// http://localhost:3000/api/send
// http://localhost:5000/files/9ecb82d2-4f62-457e-86ac-8804fabc5d0b
// http://localhost:5000/files/download/9ecb82d2-4f62-457e-86ac-8804fabc5d0b

// { "src": "/api/.*", "dest": "server.js" },
// { "src": "/files/.*", "dest": "server.js" },
// {
//     "src": "/api/files",
//         "dest": "server.js"
// },
// {
//     "src": "/api/send",
//         "dest": "server.js"
// },
// {
//     "src": "/files/(.*)",
//         "dest": "server.js"
// },
// {
//     "src": "/files/download/(.*)",
//         "dest": "server.js"

