# Badminton Report Application

A Next.js application for tracking badminton shuttlecock usage and costs integrated with Google Sheets.

## Features

- 📊 Dashboard with total calculations
- 📅 Date range filtering
- ➕ Add new records directly to Google Sheets
- 🔄 Real-time sync with Google Sheets
- 📱 Responsive design with Tailwind CSS

## Google Sheet Structure

The application uses a Google Sheet with the following columns:

- **No**: Auto-incremented record number
- **Player**: Name of the player
- **How many shuttlecock**: Number of shuttlecocks used
- **Price**: Cost in IDR
- **Date**: Date of the record

**Sheet URL**: https://docs.google.com/spreadsheets/d/1YaJcIfl8r0XLxK8dm8nkcucgGNJnwG7Ra7i-U04q_TA/edit

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheets Access

#### Option A: Public Sheet (Easiest - No Authentication)

1. Open the Google Sheet
2. Click "Share" button in the top right
3. Change access to "Anyone with the link" can **edit**
4. No need to set up environment variables
5. Click "Initialize Sheet" button in the app to create headers

#### Option B: Private Sheet with Service Account (More Secure)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Skip granting access and click "Done"
5. Generate a JSON key:
   - Click on the service account email
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the file
6. Share the Google Sheet:
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (found in the JSON file)
   - Give it "Editor" permission
7. Configure environment:
   - Copy `.env.example` to `.env.local`
   - Copy the entire content of the JSON key file
   - Paste it as a single line in `GOOGLE_SERVICE_ACCOUNT_KEY`

```bash
cp .env.example .env.local
# Edit .env.local and add your service account key
```

### 3. Initialize the Sheet

1. Start the development server:

```bash
npm run dev
```

2. Open http://localhost:3000
3. Click the "Initialize Sheet" button to create the column headers

### 4. Start Using the App

- **Add Records**: Click "Add Record" button to add new entries
- **View Dashboard**: See total from last date and filtered totals
- **Filter by Date**: Use the date range filter to view specific periods
- **All changes sync to Google Sheets**: Data is stored directly in your Google Sheet

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
badminton/
├── app/
│   ├── api/
│   │   ├── init/          # Initialize sheet headers
│   │   └── records/       # CRUD operations for records
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── lib/
│   └── sheets.ts          # Google Sheets integration
├── types/
│   └── index.ts           # TypeScript types
├── .env.example           # Environment variables template
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Google Sheets API**: Data storage and sync
- **googleapis**: Google API client library

## Features in Detail

### Dashboard

- Shows total money from the last date (most recent date in records)
- Shows total money from filtered date range
- Displays all records in a table format

### Date Filtering

- Filter records by date range (from/to)
- Clear filters button to reset
- Real-time filtering without page reload

### Add Records

- Form to add new records
- Auto-increment record number
- Validates all required fields
- Immediately syncs to Google Sheets

## Troubleshooting

### Sheet not found error

- Verify the spreadsheet ID in `lib/sheets.ts` matches your sheet
- Ensure the sheet has proper sharing permissions

### Authentication errors

- Check your service account JSON key is correctly formatted in `.env.local`
- Verify the service account email has edit access to the sheet
- Make sure Google Sheets API is enabled in your Google Cloud project

### Data not appearing

- Click "Initialize Sheet" to create headers
- Check browser console for errors
- Verify your internet connection
- Ensure the sheet name in `lib/sheets.ts` matches your actual sheet name (default: "List")

## License

ISC
