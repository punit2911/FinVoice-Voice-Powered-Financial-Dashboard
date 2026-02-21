require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const voiceRoutes = require('./routes/voice');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const { seedDatabase } = require('./services/seedService');
    await seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/voice', voiceRoutes);
app.use('/api/data', dataRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
