const INTENTS = {
  LAST_TRANSACTIONS: 'last_transactions',
  MONTHLY_SPENDING: 'monthly_spending',
  CATEGORY_SPENDING: 'category_spending',
  UNKNOWN: 'unknown'
};

const intentPatterns = {
  [INTENTS.LAST_TRANSACTIONS]: [
    /last\s+\d*\s*transactions?/i,
    /recent\s+transactions?/i,
    /show.*transactions?/i,
    /latest\s+transactions?/i,
    /transaction\s+history/i,
    /my\s+transactions?/i
  ],
  [INTENTS.MONTHLY_SPENDING]: [
    /monthly\s+spend/i,
    /spend.*month/i,
    /month.*spend/i,
    /monthly\s+expenses?/i,
    /expenses?\s+by\s+month/i,
    /spending\s+trend/i,
    /month.*over.*month/i,
    /per\s+month/i
  ],
  [INTENTS.CATEGORY_SPENDING]: [
    /spend.*categor/i,
    /categor.*spend/i,
    /breakdown/i,
    /by\s+categor/i,
    /spending\s+distribution/i,
    /where.*money/i,
    /expense\s+categor/i
  ]
};

function resolveIntent(transcript) {
  const text = transcript.toLowerCase().trim();
  
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return intent;
      }
    }
  }
  
  return INTENTS.UNKNOWN;
}

function extractTransactionCount(transcript) {
  const match = transcript.match(/last\s+(\d+)\s+transactions?/i);
  if (match) {
    const count = parseInt(match[1]);
    return Math.min(Math.max(count, 1), 50);
  }
  return 5;
}

module.exports = { resolveIntent, extractTransactionCount, INTENTS };
