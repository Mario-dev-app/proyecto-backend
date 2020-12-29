require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//CORS Config
let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// export routes
app.use(require('./routes/routes'));

//Express Server
app.listen(3000, () => {
    console.log('Servidor levantado en el puerto 3000');
});

//Mongo DataBase
mongoose.connect('mongodb://localhost:27017/biblioteca', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then( () => console.log('Base de datos ONLINE'))
.catch( err => console.log(err));