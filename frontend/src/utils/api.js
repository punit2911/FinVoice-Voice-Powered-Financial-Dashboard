const API_BASE = process.env.REACT_APP_API_URL || '/api';

export async function sendAudioForTranscription(audioBlob) {
  const formData = new FormData();
  const extension = audioBlob.type.includes('webm') ? '.webm' : 
                    audioBlob.type.includes('ogg') ? '.ogg' : '.webm';
  formData.append('audio', audioBlob, `recording${extension}`);

  const response = await fetch(`${API_BASE}/voice/transcribe`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to process audio');
  }

  return response.json();
}

export async function sendTextIntent(text) {
  const response = await fetch(`${API_BASE}/voice/text-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to process text');
  }

  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE}/data/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function sendAudioFile(file) {
  const formData = new FormData();
  formData.append('audio', file, file.name);

  const response = await fetch(`${API_BASE}/voice/transcribe`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to process file');
  }

  return response.json();
}
