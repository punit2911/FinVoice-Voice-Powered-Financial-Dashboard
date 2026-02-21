const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { transcribeAudio } = require('../services/sttService');
const { resolveIntent, extractTransactionCount } = require('../services/intentService');
const { fetchDataByIntent } = require('../services/dataService');

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.webm', '.mp3', '.mp4', '.wav', '.m4a', '.ogg', '.flac'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload an audio file.'));
    }
  }
});

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const filePath = req.file.path;

  try {
    const transcript = await transcribeAudio(filePath);
    
    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ error: 'Could not transcribe audio. Please speak clearly and try again.' });
    }

    const intent = resolveIntent(transcript);
    const count = extractTransactionCount(transcript);
    const result = await fetchDataByIntent(intent, { count });

    res.json({
      transcript,
      intent,
      ...result
    });
  } catch (err) {
    console.error('Voice processing error:', err);
    res.status(500).json({ 
      error: 'Failed to process audio',
      message: err.message 
    });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

router.post('/text-intent', express.json(), async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const intent = resolveIntent(text);
    const count = extractTransactionCount(text);
    const result = await fetchDataByIntent(intent, { count });

    res.json({
      transcript: text,
      intent,
      ...result
    });
  } catch (err) {
    console.error('Intent resolution error:', err);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: err.message 
    });
  }
});

module.exports = router;
