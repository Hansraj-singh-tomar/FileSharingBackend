const router = require('express').Router();
const File = require('../models/file');
const axios = require('axios');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });

        if (!file) {
            return res.render('download', { error: 'Link has been expired' });
        }

        const cloudinaryUrl = file.url;
        const fileName = file.fileName;

        // Fetch the file from Cloudinary and stream it to the client
        const response = await axios.get(cloudinaryUrl, { responseType: 'stream' });

        // Set the headers to prompt download with a custom filename
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', response.headers['content-type']);

        // Pipe the Cloudinary file stream to the response stream
        response.data.pipe(res);

        // ---------------------------

        // if file is stored in local then we can directly show the pop of download
        // res.download(file.url, file.fileName)
        // res.download(file.path, file.fileName);
        // res.download(file.path, 'image.jpeg'); // kuch bhi name de sakte hain
    } catch (error) {
        return res.render('download', { error: 'Something went wrong' });
    }
})

module.exports = router;