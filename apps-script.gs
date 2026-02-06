/**
 * Google Apps Script to serve Google Sheet data as an API
 * Usage: Deploy as web app and call endpoints like:
 * - /api/sheets (returns all sheets data)
 * - /api/sheets?sheet=Sheet1 (returns specific sheet data)
 */

// Main HTTP handler
function doGet(e) {
  const sheetParam = e.parameter.sheet;
  
  try {
    let data;
    
    if (sheetParam) {
      // Return specific sheet
      data = getSheetData(sheetParam);
    } else {
      // Return all sheets
      data = getAllSheetsData();
    }
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get data from all sheets
 */
function getAllSheetsData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const result = {};
  
  sheets.forEach(sheet => {
    result[sheet.getName()] = convertSheetToObjects(sheet);
  });
  
  return result;
}

/**
 * Get data from a specific sheet by name
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }
  
  return {
    [sheetName]: convertSheetToObjects(sheet)
  };
}

/**
 * Convert a sheet to an array of objects using the first row as headers
 */
function convertSheetToObjects(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length === 0) {
    return [];
  }
  
  // First row is headers
  const headers = values[0].map(header => String(header).trim());
  
  // Convert remaining rows to objects
  const result = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    const row = values[i];
    
    headers.forEach((header, colIndex) => {
      obj[header] = row[colIndex] || null;
    });
    
    result.push(obj);
  }
  
  return result;
}

/**
 * Helper function to test locally (run in Apps Script editor)
 */
function testAPI() {
  const data = getAllSheetsData();
  Logger.log(JSON.stringify(data, null, 2));
}
