# Badminton App - Setup Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A public Google Sheet

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd badminton

# Install dependencies
npm install
```

### 2. Configure Google Sheet

The application reads data from a public Google Sheet. You need to:

1. **Create or open your Google Sheet**

   - Create a new sheet or use existing one
   - Your spreadsheet should have two sheets: `List` and `Total`

2. **Structure for "List" sheet:**

   ```
   | No | Pemain | Total Bola | Harga Sebenarnya | Harga Dibayar | Selisih | Tanggal |
   |----|--------|------------|------------------|---------------|---------|---------|
   | 1  | Andi   | 10         | Rp25.000        | Rp30.000     | Rp5.000 | 1/15/2025 |
   ```

3. **Structure for "Total" sheet:**

   ```
   | Label         | Value                  |
   |---------------|------------------------|
   | Initial Total | 200000                 |
   | Total         | =B2+SUM(List!F2:F)    |
   ```

4. **Make the sheet public:**

   - Click "Share" button
   - Change to "Anyone with the link can **view**"
   - Copy the spreadsheet ID from URL
   - Example: `https://docs.google.com/spreadsheets/d/`**`1YaJcIfl8r0XLxK8dm8nkcucgGNJnwG7Ra7i-U04q_TA`**`/edit`

5. **Update the Spreadsheet ID:**
   - Open `lib/sheets.ts`
   - Update the `SPREADSHEET_ID` constant:
   ```typescript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Features

### Main Dashboard (`/`)

- View all transaction records from Google Sheet
- Filter by date range (start date and end date)
- See **Total Kas Keseluruhan** (overall total from Total sheet)
- See **Total Kas Periode** (period total when date filter is active)
- Pagination (100 items per page)
- Automatic data refresh

### Scoreboard (`/skor`)

- Badminton score tracking for Tim A and Tim B
- Win conditions: First to 21 points with 2-point lead
- Maximum score: 30 points
- Score persistence using localStorage
- Undo last action
- Reset with confirmation dialog
- Automatic winner detection

## Project Structure

```
badminton/
├── app/
│   ├── api/
│   │   ├── records/route.ts    # Fetch records from List sheet
│   │   └── total/route.ts      # Fetch total from Total sheet
│   ├── skor/
│   │   └── page.tsx            # Scoreboard page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main dashboard
├── components/
│   └── ui/
│       ├── button.tsx          # Button component
│       └── card.tsx            # Card components
├── lib/
│   ├── sheets.ts               # Google Sheets API integration
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript definitions
├── documentation/
│   └── instruction.md          # Original instructions
├── .gitignore
├── SETUP.md                    # This file
├── README.md                   # Project overview
├── package.json
└── tailwind.config.ts
```

## Technology Stack

- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Styling with @tailwindcss/postcss
- **React DatePicker** - Date range selection
- **Google Visualization API** - Public sheet data fetching
- **Radix UI** - Accessible component primitives

## Key Configuration Files

### `lib/sheets.ts`

Contains the spreadsheet ID and data fetching logic:

```typescript
const SPREADSHEET_ID = "1YaJcIfl8r0XLxK8dm8nkcucgGNJnwG7Ra7i-U04q_TA";
```

### `tailwind.config.ts`

Tailwind CSS v4 configuration with custom theme.

### `package.json`

All project dependencies and scripts.

## Troubleshooting

### Data not loading

- Verify spreadsheet ID is correct in `lib/sheets.ts`
- Ensure the sheet is public (Anyone with link can view)
- Check that sheet names are "List" and "Total"
- Open browser console to see detailed error messages

### Date filter not working

- Ensure dates in Google Sheet are in valid format (M/D/YYYY)
- Check that the "Tanggal" column contains proper date values

### Build errors

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Scoreboard score lost on refresh

- Scores are saved to localStorage automatically
- Ensure localStorage is enabled in your browser
- Check browser console for localStorage errors

## Notes

- **Read-only mode**: This app only reads from Google Sheets, no write operations
- **No authentication required**: Works with public sheets
- **Client-side rendering**: Date filtering happens in browser
- **localStorage**: Scoreboard state persists locally per device

## Support

For issues or questions, please check:

1. Browser console for error messages
2. Google Sheet structure matches expected format
3. Spreadsheet ID is correctly configured
4. Sheet is publicly accessible

## License

ISC
