const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');
const path = require('path');



const app = express();

//db
dbConnection()

app.use(cors())

app.use(express.static('public'));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})