require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const File = require('../models/file');

const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 }, // 100MB
}).single('myfile');

router.post('/', (req, res) => {
    // store file
    upload(req, res, async (err) => {
        // validate file
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        // store file in db
        const file = new File({
            fileName: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size,
        });
        await file.save()
            .then((file) => {
                res.json({ file: `${process.env.BASE_URL}/files/${file.uuid}` });
            })
            .catch((err) => {
                console.log(err);
            });

    });
});

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;


    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({ error: 'All fields are required except expiry time' });
    }


    // Get data from DB
    try {
        const file = await File.findOne({ uuid: uuid });;
        if (file.sender) {
            return res.status(422).json({ error: 'Something went wrong, sender already exist' });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();


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
            return res.json({ success: true });
        }).catch((error) => {
            return res.status(500).json({ error: 'Something went wrong, sending mail' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong, catch part' });
    }
})

module.exports = router;

