const Transaction = require('../models/Transaction');

const sampleTransactions = [
  { description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date('2025-01-05'), type: 'debit' },
  { description: 'Grocery Store', amount: 87.43, category: 'Food', date: new Date('2025-01-08'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-01-10'), type: 'credit' },
  { description: 'Electric Bill', amount: 112.50, category: 'Utilities', date: new Date('2025-01-12'), type: 'debit' },
  { description: 'Coffee Shop', amount: 6.75, category: 'Food', date: new Date('2025-01-14'), type: 'debit' },
  { description: 'Gym Membership', amount: 45.00, category: 'Health', date: new Date('2025-01-15'), type: 'debit' },
  { description: 'Amazon Purchase', amount: 34.99, category: 'Shopping', date: new Date('2025-01-18'), type: 'debit' },
  { description: 'Restaurant Dinner', amount: 62.00, category: 'Food', date: new Date('2025-01-22'), type: 'debit' },
  { description: 'Gas Station', amount: 48.20, category: 'Transport', date: new Date('2025-01-25'), type: 'debit' },
  { description: 'Online Course', amount: 29.99, category: 'Education', date: new Date('2025-01-28'), type: 'debit' },
  { description: 'Freelance Payment', amount: 800.00, category: 'Income', date: new Date('2025-02-02'), type: 'credit' },
  { description: 'Spotify Premium', amount: 9.99, category: 'Entertainment', date: new Date('2025-02-03'), type: 'debit' },
  { description: 'Grocery Store', amount: 95.20, category: 'Food', date: new Date('2025-02-06'), type: 'debit' },
  { description: 'Internet Bill', amount: 60.00, category: 'Utilities', date: new Date('2025-02-09'), type: 'debit' },
  { description: 'Clothing Store', amount: 79.50, category: 'Shopping', date: new Date('2025-02-11'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-02-10'), type: 'credit' },
  { description: 'Coffee Shop', amount: 12.40, category: 'Food', date: new Date('2025-02-13'), type: 'debit' },
  { description: 'Doctor Visit', amount: 150.00, category: 'Health', date: new Date('2025-02-15'), type: 'debit' },
  { description: 'Uber Ride', amount: 18.75, category: 'Transport', date: new Date('2025-02-18'), type: 'debit' },
  { description: 'Restaurant Lunch', amount: 28.50, category: 'Food', date: new Date('2025-02-20'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-03-10'), type: 'credit' },
  { description: 'Grocery Store', amount: 102.80, category: 'Food', date: new Date('2025-03-05'), type: 'debit' },
  { description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date('2025-03-05'), type: 'debit' },
  { description: 'Electric Bill', amount: 98.30, category: 'Utilities', date: new Date('2025-03-08'), type: 'debit' },
  { description: 'Amazon Purchase', amount: 55.00, category: 'Shopping', date: new Date('2025-03-12'), type: 'debit' },
  { description: 'Gas Station', amount: 51.40, category: 'Transport', date: new Date('2025-03-15'), type: 'debit' },
  { description: 'Coffee Shop', amount: 9.20, category: 'Food', date: new Date('2025-03-17'), type: 'debit' },
  { description: 'Gym Membership', amount: 45.00, category: 'Health', date: new Date('2025-03-15'), type: 'debit' },
  { description: 'Book Purchase', amount: 22.00, category: 'Education', date: new Date('2025-03-19'), type: 'debit' },
  { description: 'Restaurant Dinner', amount: 74.00, category: 'Food', date: new Date('2025-03-21'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-04-10'), type: 'credit' },
  { description: 'Grocery Store', amount: 88.60, category: 'Food', date: new Date('2025-04-04'), type: 'debit' },
  { description: 'Phone Bill', amount: 75.00, category: 'Utilities', date: new Date('2025-04-06'), type: 'debit' },
  { description: 'Concert Tickets', amount: 120.00, category: 'Entertainment', date: new Date('2025-04-09'), type: 'debit' },
  { description: 'Uber Ride', amount: 22.30, category: 'Transport', date: new Date('2025-04-12'), type: 'debit' },
  { description: 'Pharmacy', amount: 35.80, category: 'Health', date: new Date('2025-04-14'), type: 'debit' },
  { description: 'Clothing Store', amount: 149.90, category: 'Shopping', date: new Date('2025-04-16'), type: 'debit' },
  { description: 'Coffee Shop', amount: 8.50, category: 'Food', date: new Date('2025-04-19'), type: 'debit' },
  { description: 'Online Course', amount: 49.99, category: 'Education', date: new Date('2025-04-22'), type: 'debit' },
  { description: 'Restaurant Dinner', amount: 58.00, category: 'Food', date: new Date('2025-04-25'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-05-10'), type: 'credit' },
  { description: 'Grocery Store', amount: 91.20, category: 'Food', date: new Date('2025-05-03'), type: 'debit' },
  { description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: new Date('2025-05-05'), type: 'debit' },
  { description: 'Electric Bill', amount: 105.70, category: 'Utilities', date: new Date('2025-05-07'), type: 'debit' },
  { description: 'Gas Station', amount: 44.80, category: 'Transport', date: new Date('2025-05-11'), type: 'debit' },
  { description: 'Doctor Visit', amount: 200.00, category: 'Health', date: new Date('2025-05-13'), type: 'debit' },
  { description: 'Amazon Purchase', amount: 67.50, category: 'Shopping', date: new Date('2025-05-16'), type: 'debit' },
  { description: 'Coffee Shop', amount: 11.20, category: 'Food', date: new Date('2025-05-19'), type: 'debit' },
  { description: 'Book Purchase', amount: 18.99, category: 'Education', date: new Date('2025-05-22'), type: 'debit' },
  { description: 'Restaurant Lunch', amount: 32.00, category: 'Food', date: new Date('2025-05-25'), type: 'debit' },
  { description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: new Date('2025-06-10'), type: 'credit' },
  { description: 'Freelance Payment', amount: 1200.00, category: 'Income', date: new Date('2025-06-05'), type: 'credit' },
  { description: 'Grocery Store', amount: 115.40, category: 'Food', date: new Date('2025-06-04'), type: 'debit' },
  { description: 'Vacation Hotel', amount: 450.00, category: 'Travel', date: new Date('2025-06-08'), type: 'debit' },
  { description: 'Gym Membership', amount: 45.00, category: 'Health', date: new Date('2025-06-15'), type: 'debit' },
  { description: 'Coffee Shop', amount: 7.80, category: 'Food', date: new Date('2025-06-18'), type: 'debit' },
  { description: 'Clothing Store', amount: 89.00, category: 'Shopping', date: new Date('2025-06-21'), type: 'debit' },
  { description: 'Internet Bill', amount: 60.00, category: 'Utilities', date: new Date('2025-06-09'), type: 'debit' },
  { description: 'Restaurant Dinner', amount: 85.00, category: 'Food', date: new Date('2025-06-24'), type: 'debit' },
  { description: 'Airline Tickets', amount: 320.00, category: 'Travel', date: new Date('2025-06-26'), type: 'debit' }
];

async function seedDatabase() {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    await Transaction.insertMany(sampleTransactions);
    console.log('Database seeded with sample transactions');
  }
}

module.exports = { seedDatabase };
