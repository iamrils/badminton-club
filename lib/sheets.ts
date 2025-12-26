const SPREADSHEET_ID = "1YaJcIfl8r0XLxK8dm8nkcucgGNJnwG7Ra7i-U04q_TA";
const SHEET_NAME = "List";

// Fetch data from public Google Sheet using CSV export
async function fetchPublicSheetData(range: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${range}`;
  const response = await fetch(url);
  const text = await response.text();

  // Parse Google Visualization API response
  const jsonString = text.substring(47).slice(0, -2);
  const data = JSON.parse(jsonString);

  return data.table.rows || [];
}

export async function getRecords() {
  try {
    const rows = await fetchPublicSheetData(SHEET_NAME);

    return rows.slice(1).map((row: any) => {
      const cells = row.c || [];

      // Helper function to parse currency values
      const parseCurrency = (value: string) => {
        if (!value) return 0;
        if (typeof value === "number") return value;

        // Remove Rp and spaces
        let cleanValue = value.toString().replace(/Rp\s*/gi, "").trim();

        // Detect format based on comma and dot positions
        const lastComma = cleanValue.lastIndexOf(",");
        const lastDot = cleanValue.lastIndexOf(".");

        if (lastComma > -1 && lastDot > -1) {
          // Both comma and dot present
          if (lastComma > lastDot) {
            // Format: 1.234,56 (European/Indonesian) - dot is thousand separator, comma is decimal
            cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
          } else {
            // Format: 1,234.56 (US) - comma is thousand separator, dot is decimal
            cleanValue = cleanValue.replace(/,/g, "");
          }
        } else if (lastComma > -1) {
          // Only comma present
          const afterComma = cleanValue.substring(lastComma + 1);
          if (afterComma.length === 3 && !cleanValue.includes(".")) {
            // Format: 25,000 (thousand separator) - remove comma
            cleanValue = cleanValue.replace(/,/g, "");
          } else {
            // Format: 25,50 (decimal separator) - replace comma with dot
            cleanValue = cleanValue.replace(",", ".");
          }
        } else if (lastDot > -1) {
          // Only dot present
          const afterDot = cleanValue.substring(lastDot + 1);
          if (afterDot.length === 3 && cleanValue.split(".").length === 2) {
            // Format: 25.000 (thousand separator) - remove dot
            cleanValue = cleanValue.replace(/\./g, "");
          }
          // Otherwise keep dot as decimal separator
        }

        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : parsed;
      };

      const getValue = (cell: any) => {
        // Handle date cells
        if (
          cell?.v &&
          typeof cell.v === "string" &&
          cell.v.startsWith("Date(")
        ) {
          // Google Sheets date format: "Date(2024,11,1)" (month is 0-indexed)
          const match = cell.v.match(/Date\((\d+),(\d+),(\d+)\)/);
          if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) + 1; // Convert to 1-indexed
            const day = parseInt(match[3]);
            return `${month}/${day}/${year}`;
          }
        }
        return cell?.v ?? cell?.f ?? "";
      };

      return {
        no: parseInt(getValue(cells[0]) || "0"),
        pemain: getValue(cells[1]) || "",
        totalBola: parseInt(getValue(cells[2]) || "0"),
        hargaSebenarnya: parseCurrency(getValue(cells[3])),
        hargaDibayar: parseCurrency(getValue(cells[4])),
        selisih: parseCurrency(getValue(cells[5])),
        tanggal: getValue(cells[6]) || "",
      };
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
}

export async function getTotalValue() {
  try {
    const rows = await fetchPublicSheetData("Total");

    console.log("Total sheet rows:", JSON.stringify(rows, null, 2));

    // Get B3 cell - "Total" row (index 1, column B is index 1)
    const cellValue = rows[1]?.c?.[1];
    console.log("Cell B3 value:", cellValue);

    let value = cellValue?.v ?? cellValue?.f ?? "0";
    console.log("Extracted value:", value);

    // Helper function to parse currency values (reuse from getRecords)
    const parseCurrency = (val: any) => {
      if (!val) return 0;
      if (typeof val === "number") return val;

      // Remove Rp and spaces
      let cleanValue = val.toString().replace(/Rp\s*/gi, "").trim();

      // Detect format based on comma and dot positions
      const lastComma = cleanValue.lastIndexOf(",");
      const lastDot = cleanValue.lastIndexOf(".");

      if (lastComma > -1 && lastDot > -1) {
        // Both comma and dot present
        if (lastComma > lastDot) {
          // Format: 1.234,56 (European/Indonesian) - dot is thousand separator, comma is decimal
          cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
        } else {
          // Format: 1,234.56 (US) - comma is thousand separator, dot is decimal
          cleanValue = cleanValue.replace(/,/g, "");
        }
      } else if (lastComma > -1) {
        // Only comma present
        const afterComma = cleanValue.substring(lastComma + 1);
        if (afterComma.length === 3 && !cleanValue.includes(".")) {
          // Format: 25,000 (thousand separator) - remove comma
          cleanValue = cleanValue.replace(/,/g, "");
        } else {
          // Format: 25,50 (decimal separator) - replace comma with dot
          cleanValue = cleanValue.replace(",", ".");
        }
      } else if (lastDot > -1) {
        // Only dot present
        const afterDot = cleanValue.substring(lastDot + 1);
        if (afterDot.length === 3 && cleanValue.split(".").length === 2) {
          // Format: 25.000 (thousand separator) - remove dot
          cleanValue = cleanValue.replace(/\./g, "");
        }
        // Otherwise keep dot as decimal separator
      }

      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    const result = parseCurrency(value);
    console.log("Parsed total:", result);
    return result;
  } catch (error) {
    console.error("Error fetching total value:", error);
    return 0;
  }
}
