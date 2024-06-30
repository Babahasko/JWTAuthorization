require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const PORT = 3000;
const host = '127.0.0.1';

const posts = [
    {
        username: 'Dan',
        title: 'Post 1'
    },
    {
        username: 'Kyle',
        title: 'Post 2'
    },
    {
        username: 'Andrew',
        title: 'Post 3'
    }
]
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

app.post('/login', (req, res) => {
    //AuthUser
    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}
app.listen(PORT, host)