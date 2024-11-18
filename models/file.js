const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: false
    },
    receiver: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);

// module.exports.createFile = async (name, path, size, uuid, sender, receiver) => {
//     const file = new File({
//         name,
//         path,
//         size,
//         uuid,
//         sender,
//         receiver
//     });
//     await file.save();
// }