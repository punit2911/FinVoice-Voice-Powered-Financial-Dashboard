import React, { useEffect, useState } from 'react';
import { fetchStats } from '../utils/api';
import styles from './StatsBar.module.css';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconBox} style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className={styles.info}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className={styles.bar}>
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        }
        label="Total Spent"
        value={`$${stats.totalSpent.toFixed(2)}`}
        color="#ef4444"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        }
        label="Total Income"
        value={`$${stats.totalIncome.toFixed(2)}`}
        color="#10b981"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 3H8L2 7h20z"/>
          </svg>
        }
        label="Transactions"
        value={stats.transactionCount}
        color="#4f8ef7"
      />
      <StatCard
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        }
        label="Net Balance"
        value={`$${(stats.totalIncome - stats.totalSpent).toFixed(2)}`}
        color="#8b5cf6"
      />
    </div>
  );
}
