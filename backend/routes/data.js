const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments();

    res.json({ transactions, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalSpent = await Transaction.aggregate([
      { $match: { type: 'debit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = await Transaction.aggregate([
      { $match: { type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const transactionCount = await Transaction.countDocuments();

    res.json({
      totalSpent: totalSpent[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
      transactionCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
