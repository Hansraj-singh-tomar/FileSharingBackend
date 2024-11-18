require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
connectDB();

// Cors
// app.use(cors({
//     origin: process.env.ALLOWED_CLIENTS, // specify the allowed origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // specify allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // specify allowed headers
//     credentials: true, // if you need to send cookies or authentication headers
// }));


const corsOptions = {
    // origin: process.env.ALLOWED_CLIENTS,
    // origin: process.env.ALLOWED_CLIENTS.split(","),
    origin: process.env.ALLOWED_CLIENTS,
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

