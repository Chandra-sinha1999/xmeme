const express = require('express');//importing express modules
const app = express();//calling express functions in app

const mongoose = require('mongoose');//imorting mongoose modules

const bodyParser = require('body-parser');//for parsing the recived string

const path = require('path');//for getting the location of directory

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
//enabling parser methodogies
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//serving html
const staticpath = path.join(__dirname);
app.use(express.static(staticpath));

//connecting db

mongoose.connect("mongodb://localhost/playground",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDb...'))
.catch((err) => console.error('Could not connect to MongoDb...',err));


//defining db schema
const memeSchema = new mongoose.Schema({
    name: String,
    caption: String,
    url: String
});

const Meme = mongoose.model('Meme', memeSchema);

async function createMeme(author,caption,url) {
    const meme = new Meme({
        name: author,
        caption: caption,
        url: url
    });
    const result = await meme.save();
};

async function getRequest() {
    const memes = await Meme.find().sort({_id:-1}).limit(100);
    return memes;
};

async function getLastid() {
    const meme = await Meme.find({},'_id').sort({_id:-1}).limit(1);
    return meme[0];
};

async function idApi(author,caption,url) {
    await createMeme(author,caption,url);
    const id = await getLastid();
    return id;
};

async function waitfor() {
    const memes = await getRequest();
    return memes;
};

async function getDetails(id) {
    const meme =await  Meme.find({_id: id});
    return meme[0];
};

//Routes
app.post('/', (req,res,next) => {
     const author = req.body.name;
     const caption = req.body.caption;
     const url = req.body.url;
     createMeme(author,caption,url);
     res.redirect('/index.html');
});

app.post('/memes',(req,res,next) => {
    const author = req.param('name');
    const caption = req.param('caption');
    const url = req.param('url');
    idApi(author,caption,url).then((re) => {res.send(re)});
});


app.get('/memes/:id',(req,res) => {
    const id = req.params.id;
    getDetails(id).then((rs) => {res.send(rs)});
});

app.get('/memes',(req,res) => {
    waitfor().then((re) => {res.send(re)});
});

app.listen(PORT);
