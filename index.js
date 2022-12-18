const express = require('express');
const path = require('path');
const noteData = require('./db/notes.json');
const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });

app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    let response;

  if (req.body) {
    response = {
      status: 'success',
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json("Request body can't be blank");
  }

  console.log(req.body);
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });