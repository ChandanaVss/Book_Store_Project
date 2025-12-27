const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: '/tmp' });

// Add Single Book
router.post('/add', (req, res) => {
  const { title, author,published_date} = req.body;
  if(!title||!author||!published_date){
    return res.status(400).send('All fields are required')
  }
  const sql = 'INSERT INTO books (title, author, published_date) VALUES (?, ?,?)';
  db.query(sql, [title, author,published_date], (err) => {
    if (err){
      console.error(err);
      return res.status(500).send('Database Error');
    }
    res.send('Book added successfully');
  });
});

// Upload CSV File
router.post('/upload', upload.single('csvFile'), (req, res) => {
  const filePath = req.file.path;
  const books = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.title && row.author && row.published_date) {
        books.push([row.title, row.author, row.published_date]);
      }
    })
    .on('end', () => {
      if (books.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).send('No valid data found in CSV.');
      }

      const sql = 'INSERT INTO books (title, author, published_date) VALUES ?';
      db.query(sql, [books], (err) => {
        fs.unlinkSync(filePath);
        if (err) return res.status(500).send('Database Error');
        res.send('CSV data uploaded successfully');
      });
    });
});

// Read All Books
router.get('/list', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).send('Database Error');
    res.json(results);
  });
});

// Update Book
router.put('/update/:id', (req, res) => {
  const { title, author, published_date } = req.body;
  const sql = 'UPDATE books SET title=?, author=?, published_date=? WHERE id=?';
  db.query(sql, [title, author, published_date, req.params.id], (err) => {
    if (err) return res.status(500).send('Database Error');
    res.send('Book updated successfully');
  });
});

// Delete Book
router.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM books WHERE id=?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send('Database Error');
    res.send('Book deleted successfully');
  });
});

module.exports = router;
