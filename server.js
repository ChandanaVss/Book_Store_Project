require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const booksRoute = require('./routes/books');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/books', booksRoute);

const PORT =process.env.PORT||5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
