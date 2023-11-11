// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');


const salt = bcrypt.genSaltSync(10);
const secret =  'ujk857y383ifnkmlertert6357';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://radlee:Leander247365@mern-blog.psjtrcb.mongodb.net/?retryWrites=true&w=majority');

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
    const user = await User.findOne({username})
    const passOk = bcrypt.compareSync(password, user.password)
    res.json(passOk)
})

var listener = app.listen(4000, function(){
    console.log('\nListening on port ' + listener.address().port );
});
