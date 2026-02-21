import React from 'react';
import TransactionTable from './TransactionTable';
import { LineChartView, PieChartView, BarChartView } from './Charts';
import styles from './VisualizationPanel.module.css';

const INTENT_LABELS = {
  last_transactions: 'Recent Transactions',
  monthly_spending: 'Monthly Spending Trend',
  category_spending: 'Spending by Category',
  unknown: 'Unknown Query'
};

const VIZ_ICONS = {
  table: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="9" x2="9" y2="21"/>
    </svg>
  ),
  line: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  pie: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  ),
  bar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
};

function renderVisualization(result) {
  switch (result.visualization) {
    case 'table':
      return <TransactionTable data={result.data} title={result.title} />;
    case 'line':
      return <LineChartView data={result.data} xKey={result.xKey} yKey={result.yKey} title={result.title} />;
    case 'pie':
      return <PieChartView data={result.data} labelKey={result.labelKey} valueKey={result.valueKey} />;
    case 'bar':
      return <BarChartView data={result.data} xKey={result.labelKey} yKey={result.valueKey} />;
    case 'none':
      return (
        <div className={styles.unknownState}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>{result.error}</p>
          <div className={styles.tipsList}>
            <p className={styles.tipsTitle}>Try asking:</p>
            <ul>
              <li>"Show last 5 transactions"</li>
              <li>"Show monthly spending"</li>
              <li>"Show spending by category"</li>
            </ul>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function VisualizationPanel({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Analyzing your request...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          </svg>
        </div>
        <h3>Ask a financial question</h3>
        <p>Use the voice recorder or type a query to see your financial data visualized</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>{result.title}</h2>
          {result.transcript && (
            <div className={styles.transcript}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
              <span>"{result.transcript}"</span>
            </div>
          )}
        </div>
        {result.visualization && result.visualization !== 'none' && (
          <div className={styles.vizBadge}>
            {VIZ_ICONS[result.visualization]}
            <span>{result.visualization}</span>
          </div>
        )}
      </div>

      {result.data && result.data.length > 0 && (
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            {result.data.length} {result.visualization === 'table' ? 'transactions' : 'data points'}
          </span>
          {result.visualization === 'table' && (
            <span className={styles.metaItem}>
              Total: ${result.data.reduce((s, t) => s + t.amount, 0).toFixed(2)}
            </span>
          )}
        </div>
      )}

      <div className={styles.visualization}>
        {renderVisualization(result)}
      </div>
    </div>
  );
}
