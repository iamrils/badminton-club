# Badminton Cash Tracking & Scoreboard App

A Next.js application for tracking badminton cash flow and keeping score during games, integrated with public Google Sheets.

## Features

### 💰 Cash Tracking Dashboard

- 📊 View all transaction records from Google Sheets
- 📅 Filter by date range (start and end date)
- 💵 **Total Kas Keseluruhan** - Overall total from Total sheet
- 📆 **Total Kas Periode** - Period total (shown only when date filter is active)
- 📄 Pagination with 100 items per page
- 🔄 Real-time data sync from public Google Sheet
- 📱 Responsive design with Tailwind CSS v4

### 🏸 Badminton Scoreboard

- ⚡ Real-time score tracking for Tim A and Tim B
- 🏆 Automatic winner detection (first to 21 with 2-point lead)
- 📊 Score history with undo functionality
- 💾 LocalStorage persistence (scores saved on refresh)
- 🔄 Reset with confirmation dialog
- 🎯 Follows official badminton scoring rules

## Google Sheet Structure

The application reads from a public Google Sheet with two sheets:

### "List" Sheet (Transaction Records)

- **No**: Record number
- **Total Bola**: Number of shuttlecocks
- **Harga Sebenarnya**: Actual price (IDR)
- **Harga Dibayar**: Amount paid (IDR)
- **Selisih**: Difference (calculated)
- **Tanggal**: Date (M/D/YYYY format)

### "Total" Sheet (Summary)

- **A2**: "Initial Total" | **B2**: 200000
- **A3**: "Total" | **B3**: `=B2+SUM(List!E2:E)` (formula)

**Sheet URL**: https://docs.google.com/spreadsheets/d/1YaJcIfl8r0XLxK8dm8nkcucgGNJnwG7Ra7i-U04q_TA/edit

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Google Sheet

This app uses **public Google Sheets** (read-only). No API key or authentication required!

1. **Create or use your Google Sheet** with the structure above
2. **Make it public**:
   - Click "Share" → "Anyone with the link can **view**"
3. **Copy the spreadsheet ID** from the URL:
   - Format: `https://docs.google.com/spreadsheets/d/`**SPREADSHEET_ID**`/edit`
4. **Update the ID** in `lib/sheets.ts`:
   ```typescript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```

### 3. Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### Main Dashboard (`/`)

1. **View Records**: All transactions from Google Sheet displayed in a table
2. **Date Filtering**:
   - Select start date and/or end date
   - Clear start date automatically clears end date
   - Total Kas Periode appears only when filter is active
3. **Pagination**: Navigate through records (100 per page)
4. **Navigation**: Click "Skor Badminton" to go to scoreboard

### Scoreboard (`/skor`)

1. **Score Points**: Click on Tim A or Tim B card to add points
2. **Undo**: Revert last action (disabled when no history)
3. **Reset**: Clear all scores with confirmation dialog (disabled when both scores are 0)
4. **Auto Win**: Game ends when a team reaches 21+ with 2-point lead or 30 points
5. **Persistence**: Scores automatically saved to localStorage

## Development

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Structure

```
badminton/
├── app/
│   ├── api/
│   │   ├── records/        # Fetch records from List sheet
│   │   └── total/          # Fetch total from Total sheet
│   ├── skor/
│   │   └── page.tsx        # Scoreboard page
│   ├── globals.css         # Global styles + Tailwind directives
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main dashboard page
├── components/
│   └── ui/
│       ├── button.tsx      # Button component (Radix UI style)
│       └── card.tsx        # Card components
├── lib/
│   ├── sheets.ts           # Google Sheets integration (public API)
│   └── utils.ts            # Utility functions (cn)
├── types/
│   └── index.ts            # TypeScript type definitions
├── documentation/
│   └── instruction.md      # Original project instructions
├── .gitignore              # Git ignore patterns
├── SETUP.md                # Detailed setup guide
├── README.md               # This file
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS v4 configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Technologies Used

- **Next.js 16.0.10** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with @tailwindcss/postcss
- **Google Visualization API** - Fetch data from public sheets without auth
- **React DatePicker 9.1.0** - Date range selection
- **Radix UI** - Accessible component primitives
- **localStorage** - Client-side score persistence

## Key Features Explained

### Smart Currency Parsing

Handles multiple Indonesian currency formats:

- `Rp25.000` → 25000 (dot as thousand separator)
- `Rp25,000` → 25000 (comma as thousand separator)
- `Rp1.234,56` → 1234.56 (European format)
- Automatically detects separator based on position and count

### Conditional Display

- **Total Kas Keseluruhan**: Always visible, fetches from `Total!B3`
- **Total Kas Periode**: Only shows when date filter is applied
- Cards appear/disappear based on filter state

### Date Handling

- Parses Google Sheets date format: `Date(2024,11,1)`
- Converts to `M/D/YYYY` for filtering
- Clears end date when start date is cleared
- Sets proper time bounds for accurate filtering

### Scoreboard Logic

- Win conditions:
  - First to 21 points with minimum 2-point lead
  - Maximum score is 30 (at 29-29, next point wins)
- History tracking for undo functionality
- localStorage auto-save on every state change

## Troubleshooting

### Data not loading

- Verify spreadsheet ID in `lib/sheets.ts` is correct
- Ensure sheet is public ("Anyone with the link can view")
- Check sheet names are exactly "List" and "Total"
- Open browser console for detailed error messages
- Verify internet connection

### Date filter not working

- Ensure dates in sheet are valid format
- Check Google Sheets date format is being parsed correctly
- Verify tanggal column contains proper date values

### Currency showing wrong values

- Check currency format in Google Sheet
- Supported formats: `Rp25.000`, `Rp25,000`, `Rp1.234,56`
- Avoid mixing formats in same column

### Scoreboard scores lost

- Check if localStorage is enabled in browser
- Try different browser if issue persists
- Check browser console for localStorage errors
- Scores are device-specific (not synced across devices)

### Build errors

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## License

ISC
