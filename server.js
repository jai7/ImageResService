// create an express server to listen at port 3000
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./router')
global.__basedir = __dirname;
global.__imagedir = __dirname + "/public/static/uploads/";
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// to use static files in app
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/upload', router)


app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
})