import React, { useState } from 'react';
import VoiceInput from './components/VoiceInput';
import VisualizationPanel from './components/VisualizationPanel';
import StatsBar from './components/StatsBar';
import styles from './App.module.css';

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResult = (data) => {
    setResult(data);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.logoTitle}>FinVoice</h1>
            <p className={styles.logoSub}>Voice-Powered Financial Dashboard</p>
          </div>
        </div>
        <div className={styles.headerBadge}>
          <div className={styles.liveDot} />
          <span>Live Data</span>
        </div>
      </header>

      <main className={styles.main}>
        <StatsBar />

        <div className={styles.grid}>
          <div className={styles.inputCol}>
            <div className={styles.sectionTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
              Voice Query
            </div>
            <VoiceInput onResult={handleResult} onLoading={setIsLoading} />

            {result && result.intent && result.intent !== 'unknown' && (
              <div className={styles.intentCard}>
                <div className={styles.intentRow}>
                  <span className={styles.intentLabel}>Detected intent</span>
                  <span className={styles.intentValue}>{result.intent.replace(/_/g, ' ')}</span>
                </div>
                <div className={styles.intentRow}>
                  <span className={styles.intentLabel}>Visualization</span>
                  <span className={styles.intentValue}>{result.visualization} chart</span>
                </div>
                {result.data && (
                  <div className={styles.intentRow}>
                    <span className={styles.intentLabel}>Records returned</span>
                    <span className={styles.intentValue}>{result.data.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.vizCol}>
            <div className={styles.sectionTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Visualization
            </div>
            <VisualizationPanel result={result} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
