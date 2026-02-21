import React, { useState, useRef } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { sendAudioForTranscription, sendTextIntent, sendAudioFile } from '../utils/api';
import styles from './VoiceInput.module.css';

const SUGGESTIONS = [
  'Show last 5 transactions',
  'Show monthly spending',
  'Show spending by category',
  'Show last 10 transactions'
];

export default function VoiceInput({ onResult, onLoading }) {
  const { isRecording, audioBlob, error: recorderError, startRecording, stopRecording, reset } = useAudioRecorder();
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('voice');
  const fileInputRef = useRef(null);

  const processAudio = async (blob) => {
    setIsProcessing(true);
    setError(null);
    onLoading(true);
    try {
      const result = await sendAudioForTranscription(blob);
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      onLoading(false);
      reset();
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  React.useEffect(() => {
    if (audioBlob) {
      processAudio(audioBlob);
    }
  }, [audioBlob]);

  const handleTextSubmit = async (text) => {
    const query = text || textInput.trim();
    if (!query) return;

    setIsProcessing(true);
    setError(null);
    onLoading(true);
    try {
      const result = await sendTextIntent(query);
      onResult(result);
      if (!text) setTextInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      onLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    onLoading(true);
    try {
      const result = await sendAudioFile(file);
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      onLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'voice' ? styles.active : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          Voice
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'text' ? styles.active : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Text
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'voice' && (
          <div className={styles.voicePanel}>
            <button
              className={`${styles.micBtn} ${isRecording ? styles.recording : ''}`}
              onClick={handleRecordToggle}
              disabled={isProcessing}
            >
              {isRecording ? (
                <div className={styles.stopIcon} />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
              {isRecording && <div className={styles.pulse} />}
            </button>

            <p className={styles.hint}>
              {isProcessing ? 'Processing your request...' :
               isRecording ? 'Recording... Click to stop' :
               'Click to start recording'}
            </p>

            {isProcessing && (
              <div className={styles.processingBar}>
                <div className={styles.processingFill} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div className={styles.textPanel}>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Ask about your finances..."
                className={styles.textField}
                disabled={isProcessing}
              />
              <button
                className={styles.sendBtn}
                onClick={() => handleTextSubmit()}
                disabled={isProcessing || !textInput.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <button key={s} className={styles.suggestion} onClick={() => handleTextSubmit(s)} disabled={isProcessing}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className={styles.uploadPanel}>
            <button
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {isProcessing ? 'Processing...' : 'Upload Audio File'}
            </button>
            <p className={styles.hint}>Supports MP3, WAV, M4A, WEBM, OGG, FLAC</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>

      {(error || recorderError) && (
        <div className={styles.error}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error || recorderError}
        </div>
      )}
    </div>
  );
}
