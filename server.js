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
    origin: process.env.ALLOWED_CLIENTS
}

app.use(cors(corsOptions));


app.use(express.json());

// static files
app.use(express.static('public'));

// template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.json({ "ok": "all good" })
})

// routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});