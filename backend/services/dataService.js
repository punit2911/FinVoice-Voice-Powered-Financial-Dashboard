const Transaction = require('../models/Transaction');
const { INTENTS } = require('./intentService');

async function getLastTransactions(count = 5) {
  const transactions = await Transaction.find({ type: 'debit' })
    .sort({ date: -1 })
    .limit(count)
    .lean();

  return {
    data: transactions.map(t => ({
      id: t._id,
      description: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date.toISOString().split('T')[0],
      type: t.type
    })),
    visualization: 'table',
    columns: ['description', 'amount', 'category', 'date'],
    title: `Last ${count} Transactions`
  };
}

async function getMonthlySpending() {
  const pipeline = [
    { $match: { type: 'debit' } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const results = await Transaction.aggregate(pipeline);
  
  const data = results.map(item => ({
    label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    value: parseFloat(item.total.toFixed(2)),
    count: item.count
  }));

  return {
    data,
    visualization: 'line',
    title: 'Monthly Spending Trend',
    xKey: 'label',
    yKey: 'value',
    yLabel: 'Amount ($)'
  };
}

async function getCategorySpending() {
  const pipeline = [
    { $match: { type: 'debit' } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ];

  const results = await Transaction.aggregate(pipeline);
  
  const data = results.map(item => ({
    label: item._id,
    value: parseFloat(item.total.toFixed(2)),
    count: item.count
  }));

  return {
    data,
    visualization: 'pie',
    title: 'Spending by Category',
    labelKey: 'label',
    valueKey: 'value'
  };
}

async function fetchDataByIntent(intent, options = {}) {
  switch (intent) {
    case INTENTS.LAST_TRANSACTIONS:
      return await getLastTransactions(options.count);
    case INTENTS.MONTHLY_SPENDING:
      return await getMonthlySpending();
    case INTENTS.CATEGORY_SPENDING:
      return await getCategorySpending();
    case INTENTS.UNKNOWN:
      return {
        data: [],
        visualization: 'none',
        title: 'Unknown Intent',
        error: 'Could not understand your request. Try asking about transactions, monthly spending, or spending by category.'
      };
    default:
      throw new Error(`Unhandled intent: ${intent}`);
  }
}

module.exports = { fetchDataByIntent };
