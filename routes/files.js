require('dotenv').config();
const router = require('express').Router();
const path = require('path');

const File = require('../models/file');

const cloudinary = require('cloudinary').v2;

const { v4: uuidv4 } = require('uuid');

const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer to handle file uploads in vercel server memory(RAM)
// If file size is small than it's good
// const upload = multer({ storage: multer.memoryStorage() }).single('myfile');

// Store the file temporarily on disk in a directory like / tmp(which is a temporary file storage provided by Vercel for each request).
// Vercel discards all memory used during execution
const upload = multer({ dest: '/tmp' }).single('myfile');

// Using cloudinary
router.post('/', (req, res) => {

    upload(req, res, (err) => {

        if (err) return res.status(500).json({ "error while uploading": err.message });

        if (!req.file) return res.status(400).json({ error: 'Please upload a file' });

        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req?.file?.originalname)}`;

        // Upload to Cloudinary
        cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, async (error, result) => {
            if (error) return res.status(500).json({ "error from cloudinary": error.message });

            // Save the file's public ID and expiration time (24 hours later) in the database
            const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            const file = new File({
                fileName: fileName,
                url: result.secure_url,
                uuid: uuidv4(),
                size: req.file.size,
                expirationTime: expirationTime,
                publicId: result.public_id
            })

            await file.save();

            res.json({ url: `${process.env.BASE_URL}/files/${file.uuid}` });
        });
    });
})

router.post('/send', async (req, res) => {
    console.log("first log for the send email");

    const { uuid, emailTo, emailFrom } = req.body;

    console.log(emailTo, emailFrom);

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({ error: 'All fields are required except expiry time' });
    }

    // Get data from DB
    try {
        const file = await File.findOne({ uuid: uuid });
        console.log("db data", file);

        if (!file) {
            return res.status(422).json({ error: 'File not found' });
        }

        if (file.sender) {
            return res.status(422).json({ error: 'Something went wrong, sender already exist' });
        }

        file.sender = emailFrom;
        file.receiver = emailTo;

        const response = await file.save();

        console.log("start sendMail function");

        // send mail
        const sendMail = require('../services/mailService');
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'File Sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        }).then(() => {
            console.log("send mail success part");
            return res.json({ success: true });
        }).catch((error) => {
            console.log("send mail error part");
            return res.status(500).json({ 'Something went wrong, sending mail': error });
        });
    } catch (error) {
        console.log("send mail catch part");
        return res.status(500).json({ 'Something went wrong, catch part': error });
    }
})

module.exports = router;


// Notes -

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     },
// });
// const upload = multer({
//     storage,
//     limits: { fileSize: 1000000 * 100 }, // 100MB
// }).single('myfile');

// from chat gpt - ye vercel ke tmp me file ko save karega for the time period
// const upload = multer({ dest: '/tmp' }).single('myfile');

// Multer with local storage
// router.post('/', (req, res) => {
//     // store file
//     upload(req, res, async (err) => {
//         // validate file
//         if (!req.file) {
//             return res.status(400).json({ error: 'Please upload a file' });
//         }
//         if (err) {
//             return res.status(500).json({ error: err });
//         }
//         // store file in db
//         const file = new File({
//             fileName: req.file.filename,
//             uuid: uuidv4(),
//             path: req.file.path,
//             size: req.file.size,
//         });
//         await file.save()
//             .then((file) => {
//                 res.json({ file: `${process.env.BASE_URL}/files/${file.uuid}` });
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     });
// });