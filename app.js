const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = 3000;
const Score = require('./public/model/scoreModel')

app.use('/public', express.static('./public/'))
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))

app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html')
})

app.get('/leaderboard', async (req, res) => {

    const scores = await Score.find().sort({ score: -1 });
    // for (var i = 0; scores.length > i; i++) {
    //     scores.
    // }
    // .sort({ score: -1 });
    // console.log(scores);

    res.render('pages/leaderboard', { scores })
})

app.post('/api/newScore', async (req, res) => {
    console.log(req.body);
    const score = new Score({ name: req.body.name, score: req.body.score });

    await score.save(function (err) {
        if (err) return console.log(err)
    })

    res.status(201).json({
        status: "success",
        score: score
    })
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB || process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Successful!'))

app.listen(process.env.PORT || port, () => {
    console.log('Connected')
})