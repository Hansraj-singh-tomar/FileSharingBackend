const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has been expired' });
        }

        res.download(file.path, file.fileName);
        // res.download(file.path, 'image.jpeg'); // kuch bhi name de sakte hain
    } catch (error) {
        return res.render('download', { error: 'Something went wrong' });
    }
})

module.exports = router;