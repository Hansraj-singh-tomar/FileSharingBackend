//  When deploying a project to Vercel, you need to understand that Vercel is optimized for serverless functions,
// which means it doesn’t support long - running processes like node - cron.Scripts like the one you’ve written won’t run automatically on Vercel because Vercel doesn't keep your backend continuously running.

// const cron = require('node-cron');
// const cloudinary = require('cloudinary').v2;
// const File = require('./models/file'); // Your file model to access DB

// // Cron job to delete files older than 24 hours
// cron.schedule('0 0 * * *', async () => {  // This will run every day at midnight
//     const files = await File.find({ expiration: { $lte: Date.now() } }); // Find files that have expired

//     for (let file of files) {
//         // Delete file from Cloudinary
//         cloudinary.uploader.destroy(file.public_id, async (error, result) => {
//             if (error) {
//                 console.error('Error deleting file from Cloudinary:', error);
//             } else {
//                 console.log('File deleted successfully:', result);
//                 // Optionally, remove file record from DB
//                 await file.remove(); // Example to delete the file record from the DB
//             }
//         });
//     }
// });
