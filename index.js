const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const noteData = require('./db/notes.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title&&text) {

        const newNote = {
            title,
            text,
            id: uuid(),
            
        };

        fs.readFile('./db/notes.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              // Convert string into JSON object
              const parsedNotes = JSON.parse(data);
      
              // Add a new note
              parsedNotes.push(newNote);
      
              // Write updated note back to the file
              fs.writeFile(
                './db/notes.json',
                JSON.stringify(parsedNotes, null, 8),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
              );
            }
          });
    
        const response = {
          status: 'success',
          body: newNote,
        };
    
        console.log(response);
        res.status(201).json(response);
      } else {
        res.status(500).json('Error in posting note');
      }
    });




app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });