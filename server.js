//Dependency Modules
const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser')
const path = require('path')
const routes = require('./routes/router');
const db = require('./models')
const cookieParser = require('cookie-parser')

//Environment Variables
dotenv.config({path:'config.env'});
const PORT = process.env.PORT||8080;

//Middleware
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());

//Setting Up View Engines & Assets
app.use(express.static('assets'));
app.set('view engine', 'ejs');

//Loading Routes
app.use(routes)

//Database Connection & Server Start
db.sequelize.sync().then((req) => {
    app.listen(PORT, () => {console.log(`server listening at ${PORT}`)})
})