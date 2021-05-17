const routes = require('express').Router();
const fs = require('fs');
const uploadFile = require('./upload');
const {spawn} = require('child_process');

routes.get('/', async function(req, res){
    await res.status(200).render('index');
});

routes.get('/list', function(req, res){
    fs.readdir(__imagedir, function(err, files){
        if(err){
            res.status(500).json({message: `failed to get files due to ${err}`})
        }

        const filesInfo = [];
        files.forEach((file) => {
            filesInfo.push({
                name: file,
                url: req.url + file
            })
        })
        res.status(200).json(filesInfo);
    })
})

routes.get('/download/:name', function (req, res) {
    const fileName = req.params.name;
    const directoryPath = __imagedir;

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
})

routes.post('/post', async function(req, res){
    try{
    var dataToSend = '';
    console.log("image posted to service");
    await(uploadFile(req, res));
    if(req.file == undefined){
        return res.status(400).send({message: "Try again by uploading a file."})
    }
    const python = spawn('python', ['./script.py']);
    python.stdout.on('data', function(data){
        console.log('Data stream output from python file');
        console.log('data is ' + data);
        dataToSend += data.toString();
    });
    python.on('close', (code) => {
        console.log(`child process close all with stdio code ${code}`);
        res.status(200).send({message:`Successfully uploaded the file ${req.file.originalname} with python output : ${dataToSend}`});
    })
    } catch(err){
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 2MB!",
            });
          }
        res.status(500).send({message: `Could not upload the file with error : ${err}`})
    }

})

module.exports = routes;