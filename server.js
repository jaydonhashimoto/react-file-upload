const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    //get file
    const file = req.files.file;

    //move file to directory
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        //if there is an error, send 500 with error
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        //else send 200 with file name and path
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    })
});

app.listen(5000, () => console.log('SERVER STARTED...'));