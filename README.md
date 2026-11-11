# FinVoice — Voice-Powered Financial Dashboard - Created by Punit Gavali 

A full-stack MERN application that accepts voice commands, resolves financial intents using speech-to-text transcription, fetches data from MongoDB, and dynamically renders the appropriate chart or table in the React UI — all without a page reload.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (with Recharts for data visualization) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Speech-to-Text | OpenAI Whisper/ Deepgram API |
| Audio Recording | Browser MediaRecorder Web API |

---

## Prerequisites

- Node.js v18 or higher
- MongoDB running locally (default: `mongodb://localhost:27017`) or a MongoDB Atlas connection string
- An OpenAI API key with access to the Whisper speech transcription model

---

## API Keys Required

### OpenAI API Key
Used to power the speech-to-text transcription via the Whisper model.

**How to get it:**
1. Go to [https://platform.openai.com](https://platform.openai.com) and sign in or create an account
2. Navigate to **API Keys** from the top-right account menu
3. Click **Create new secret key**, copy and save it immediately (it won't be shown again)
4. Make sure your account has billing enabled — Whisper usage is billed per minute of audio transcribed

**Cost:** Whisper is charged at $0.006 per minute of audio. For typical usage during development this is negligible.

**Model used:** `whisper-1` — OpenAI's most capable speech recognition model, supporting over 50 languages.

---

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd voice-financial-dashboard
```

### Step 2: Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice_dashboard
OPENAI_API_KEY=your_openai_api_key_here
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Install dependencies

```bash
# From the root of the project
cd backend && npm install
cd ../frontend && npm install
```

### Step 4: Start the backend

```bash
cd backend
npm run dev
```

The server will start on port 5000. On first run, it automatically seeds MongoDB with 60 sample transactions across 6 months, so the charts have real-looking data to display.

### Step 5: Start the frontend

Open a second terminal:

```bash
cd frontend
npm start
```

The React app will open at [http://localhost:3000](http://localhost:3000).

---

## Intent-to-Visualization Mapping

This is the core design of the system. When a user speaks or types a query, the backend's intent layer classifies it into one of three financial intents, then selects the most appropriate visualization for the resulting data.

### Intent 1: `last_transactions`

**Trigger phrases include:**
- "Show last 5 transactions"
- "Show recent transactions"
- "My last 10 transactions"
- "Transaction history"

**Query executed:** Fetches the most recent N debit transactions sorted by date descending. The number (e.g. 5 or 10) is extracted directly from the spoken phrase. Defaults to 5 if no number is mentioned.

**Visualization returned:** `table`

A table makes sense here because the user wants a list of discrete records with multiple attributes (description, amount, category, date). Tables are the clearest format for itemized transactional data.

---

### Intent 2: `monthly_spending`

**Trigger phrases include:**
- "Show monthly spending"
- "Spending by month"
- "Monthly expenses"
- "Spending trends"

**Query executed:** MongoDB aggregation pipeline that groups all debit transactions by year and month, summing the amounts per month.

**Visualization returned:** `line` chart

A line chart is ideal for time-series data. It clearly communicates trends, peaks, and dips in spending across months, making it easier to see patterns than a raw table would.

---

### Intent 3: `category_spending`

**Trigger phrases include:**
- "Show spending by category"
- "Category breakdown"
- "Where is my money going"
- "Spending distribution"

**Query executed:** MongoDB aggregation pipeline that groups all debit transactions by category and sums amounts per category, ordered highest to lowest.

**Visualization returned:** `pie` chart

A pie chart works best for showing proportional distribution across a finite set of categories. It immediately communicates which categories consume the largest share of spending.

---

### Unknown Intent

If the spoken or typed query cannot be matched to any of the three intents, the system returns a friendly error message with example phrases the user can try. No data query is executed.

---

## Backend API Reference

### POST `/api/voice/transcribe`
Accepts a multipart audio file, transcribes it with Whisper, resolves the intent, fetches data, and returns the result.

**Body:** `multipart/form-data` with field `audio` (audio file)

**Response:**
```json
{
  "transcript": "show last 5 transactions",
  "intent": "last_transactions",
  "data": [...],
  "visualization": "table",
  "title": "Last 5 Transactions"
}
```

### POST `/api/voice/text-intent`
Accepts plain text, skips STT, and directly resolves intent. Useful for testing without audio.

**Body:** `{ "text": "show monthly spending" }`

### GET `/api/data/stats`
Returns summary statistics (total spent, total income, transaction count).

### GET `/api/data/transactions?limit=20&page=1`
Returns paginated transactions.

---

## Project Structure

```
voice-financial-dashboard/
├── backend/
│   ├── models/
│   │   └── Transaction.js        # Mongoose schema
│   ├── routes/
│   │   ├── voice.js              # STT + intent routing
│   │   └── data.js               # Direct data endpoints
│   ├── services/
│   │   ├── sttService.js         # OpenAI Whisper integration
│   │   ├── intentService.js      # Pattern-based intent resolution
│   │   ├── dataService.js        # MongoDB queries and aggregations
│   │   └── seedService.js        # Sample data seeding
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceInput.jsx       # Recording + text + upload tabs
│   │   │   ├── VisualizationPanel.jsx  # Dynamic renderer
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── Charts.jsx            # Line, Pie, Bar chart views
│   │   │   └── StatsBar.jsx          # Summary metrics
│   │   ├── hooks/
│   │   │   └── useAudioRecorder.js   # MediaRecorder abstraction
│   │   ├── utils/
│   │   │   └── api.js                # Fetch wrappers
│   │   └── styles/
│   │       └── global.css
│   ├── public/index.html
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Features

- **Three input modes:** Real-time microphone recording, text query, or audio file upload
- **Browser-native recording:** Uses the MediaRecorder Web API — no third-party recording libraries required
- **AI transcription:** OpenAI Whisper handles speech-to-text with high accuracy across accents and noise ( Alternative : Deepgram)
- **Pattern-based intent resolution:** A dedicated intent layer separate from STT logic uses regex patterns for fast, deterministic classification
- **Dynamic UI rendering:** The React frontend renders the appropriate component (table, line chart, or pie chart) based on the `visualization` field from the backend response — no page reload required
- **Auto-seeding:** Database is seeded with 60 sample transactions on first run for immediate demo capability
- **Graceful error handling:** STT failures, empty datasets, unknown intents, and microphone permission denials are all handled with clear user-facing messages
- **Responsive design:** Works across desktop and tablet screen sizes

---

## Troubleshooting

**MongoDB not connecting:** Make sure MongoDB is running locally with `mongod` or verify your Atlas connection string.

**OpenAI API errors:** Confirm your key is valid, has billing enabled, and has not exceeded rate limits.

**Microphone not working in browser:** Chrome and Firefox require HTTPS for microphone access except on `localhost`. This project runs on localhost so it should work. If using a remote server, configure SSL or use the file upload tab instead.

**Audio format issues:** Whisper supports MP3, WAV, M4A, WEBM, OGG, and FLAC. Browser recordings are saved as WEBM which Whisper handles natively.
