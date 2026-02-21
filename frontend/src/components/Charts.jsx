import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import styles from './Charts.module.css';

const PALETTE = [
  '#4f8ef7', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#a78bfa', '#34d399', '#fb923c'
];

function formatCurrency(value) {
  return `$${value.toFixed(0)}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.tooltip}>
      {label && <p className={styles.tooltipLabel}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className={styles.tooltipValue} style={{ color: entry.color }}>
          {entry.name}: ${parseFloat(entry.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{item.name}</p>
      <p className={styles.tooltipValue} style={{ color: item.payload.fill }}>
        ${parseFloat(item.value).toFixed(2)}
      </p>
      <p className={styles.tooltipSub}>{item.payload.count} transactions</p>
    </div>
  );
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function LineChartView({ data, xKey, yKey, title }) {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#8b92a9', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: '#8b92a9', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#4f8ef7"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4f8ef7', stroke: '#1e2130', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#4f8ef7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartView({ data, labelKey, valueKey }) {
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.pieLayout}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={55}
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          {data.map((entry, i) => (
            <div key={i} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className={styles.legendLabel}>{entry[labelKey]}</span>
              <span className={styles.legendValue}>${entry[valueKey].toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BarChartView({ data, xKey, yKey }) {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#8b92a9', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: '#8b92a9', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
