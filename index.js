require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars'); 

const appointmentController = require('./controllers/appointmentController');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
    extended : true
}));

app.use(bodyParser.json());

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname:'hbs',
                         defaultLayout:'mainLayout',   
                         layoutsDir:__dirname + '/views/layouts/',
                         runtimeOptions:{ allowProtoPropertiesByDefault : true,
                                          allowProtoMethodsByDefault : true }
                        }));
app.set('view engine', 'hbs');

app.listen(3000,()=>{
    console.log("express server started at 3000...");
});

app.use('/appointment',appointmentController);