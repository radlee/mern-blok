const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
const salt = bcrypt.genSaltSync(10);
const secret = 'ujk857y383ifnkmlertert6357';
  
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://radblok2023.onrender.com"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
  });

  // Set preflight
app.options("*", (req, res) => {
    console.log("preflight");
    if (
      req.headers.origin === "https://radblok2023.onrender.com" &&
      allowMethods.includes(req.headers["access-control-request-method"]) &&
      allowHeaders.includes(req.headers["access-control-request-headers"])
    ) {
      console.log("pass");
      return res.status(204).send();
    } else {
      console.log("fail");
    }
});

app.get("/healthz", (req, res) => {
    console.log("health check is processed");
    return res.status(204).send();
});

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(
  'mongodb+srv://radlee:Leander247365@mern-blog.psjtrcb.mongodb.net/?retryWrites=true&w=majority'
);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ 
            username, 
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username})
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if(passOk) {
        //logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json('Wrong Credentials Entered');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('Ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1]
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath);

    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
    });

        res.json(postDoc);
    });
    
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if(req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1]
        newPath = path+'.'+ext
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor) {
            return res.status(400).json('Not Authorized');
        }

        await postDoc.update({
        title,
        summary,
        content,
        cover: newPath ? newPath: postDoc.cover,
        author: info.id,
    });

        res.json(postDoc);
    });
}); 

app.get('/post', async(req, res) => {
    res.json(
        await Post.find()
            .populate('author',['username'])
                  .sort({createdAt: -1 })
                  .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

var listener = app.listen(4000, () => {
    console.log('Server running on PORT: ' + listener.address().port );
});
