const express = require('express');
const router = express.Router();

// Simulated database (in-memory)
let data = [
  { id: 1, firstname: 'Tim', surname: 'Berners-Lee' },
  { id: 2, firstname: 'Roy', surname: 'Fielding' }
];

// ✅ GET /data - return all data
router.get('/', (req, res) => {
  res.status(200).json(data);
});

// ✅ GET /data/:id - return data by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find(d => d.id === id);

  if (!item) {
    return res.status(404).json({ error: `Data with id ${id} not found.` });
  }

  res.status(200).json(item);
});

// ✅ POST /data - create new entry
router.post('/', (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Unsupported Media Type. Use application/json.' });
  }

  const newEntry = req.body;

  if (!newEntry.firstname || !newEntry.surname) {
    return res.status(400).json({ error: 'firstname and surname are required.' });
  }

  const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  newEntry.id = newId;
  data.push(newEntry);

  res.status(201).json({ message: 'Data created successfully', data: newEntry });
});

// ✅ PUT /data/:id - update or create (idempotent)
router.put('/:id', (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Unsupported Media Type. Use application/json.' });
  }

  const id = parseInt(req.params.id);
  const updatedEntry = req.body;

  if (!updatedEntry.firstname || !updatedEntry.surname) {
    return res.status(400).json({ error: 'firstname and surname are required.' });
  }

  const index = data.findIndex(item => item.id === id);

  if (index === -1) {
    updatedEntry.id = id;
    data.push(updatedEntry);
    return res.status(201).json({ message: 'New data created', data: updatedEntry });
  }

  data[index] = { id, ...updatedEntry };
  res.status(200).json({ message: 'Data updated successfully', data: data[index] });
});

// ✅ DELETE /data/:id - delete data by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Data with id ${id} not found.` });
  }

  const deletedItem = data.splice(index, 1)[0];
  res.status(200).json({ message: 'Data deleted successfully', data: deletedItem });
});

// ✅ POST /data/search - find by firstname
router.post('/search', (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Unsupported Media Type. Use application/json.' });
  }

  const { forename } = req.body;

  if (!forename) {
    return res.status(400).json({ error: 'forename is required.' });
  }

  const results = data.filter(item => item.firstname.toLowerCase() === forename.toLowerCase());

  if (results.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(results);
});

module.exports = router;
