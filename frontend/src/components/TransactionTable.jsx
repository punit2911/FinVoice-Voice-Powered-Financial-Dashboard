import React from 'react';
import styles from './TransactionTable.module.css';

const CATEGORY_COLORS = {
  Food: '#10b981',
  Shopping: '#8b5cf6',
  Entertainment: '#f59e0b',
  Utilities: '#4f8ef7',
  Health: '#ec4899',
  Transport: '#06b6d4',
  Education: '#a78bfa',
  Travel: '#fb923c',
  Income: '#34d399',
  Other: '#6b7280'
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TransactionTable({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 3H8L2 7h20z"/>
        </svg>
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, i) => {
              const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
              return (
                <tr key={tx.id || i}>
                  <td>
                    <div className={styles.description}>
                      <div className={styles.dot} style={{ background: color }} />
                      {tx.description}
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge} style={{ background: `${color}20`, color }}>
                      {tx.category}
                    </span>
                  </td>
                  <td className={styles.date}>{formatDate(tx.date)}</td>
                  <td>
                    <span className={`${styles.amount} ${tx.type === 'credit' ? styles.credit : styles.debit}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
