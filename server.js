'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose")
const routes = require('./routes/routes');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const helmet = require("helmet")
const MONGODB_URI = process.env.MONGODB_URI
const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
app.use(routes)

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Default policy for loading content. 'self' refers to the current origin.
    scriptSrc: ["'self'"], // Only allow scripts from the current origin
    styleSrc: ["'self'"], // Only allow styles from the current origin
    // Add other content types as needed
  },
}));
//Start our server and tests!


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start server
    const listener = app.listen(process.env.PORT || 3000, function () {
      console.log('Your app is listening on port ' + listener.address().port);
      if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch (e) {
            console.log('Tests are not valid:');
            console.error(e);
          }
        }, 3500);
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });



module.exports = app; //for testing
