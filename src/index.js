const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const log = require('ipfy');
const bodyParser = require("body-parser")

const dataRoute = require('./routes/data');

app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(log.logger);
app.set('trust proxy', true)
app.use('/', dataRoute);

app.listen(80, () => console.log(`listening on port ${80}, amirite`));