const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function transcribeAudio(filePath) {
  const audioStream = fs.createReadStream(filePath);
  
  const transcription = await openai.audio.transcriptions.create({
    file: audioStream,
    model: 'whisper-1',
    language: 'en'
  });

  return transcription.text;
}

module.exports = { transcribeAudio };
