/**
 * Google Apps Script Client - Call external Google Apps Script API
 * Replace DEPLOYMENT_URL with your actual web app deployment URL
 */

// Replace {DEPLOYMENT_ID} with the deployment ID from Apps Script Deploy → New deployment
// Typical web app URL format (use /exec for exec endpoint):
// https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
const DEPLOYMENT_URL = 'https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec';

/**
 * Fetch all sheets data from the API
 */
function getAllSheets() {
  try {
    const url = `${DEPLOYMENT_URL}?v=1`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    Logger.log('All sheets:', data);
    return data;
  } catch (error) {
    Logger.log('Error fetching data:', error.toString());
  }
}

/**
 * Fetch data from a specific sheet
 */
function getSheet(sheetName) {
  try {
    const url = `${DEPLOYMENT_URL}?v=1&sheet=${encodeURIComponent(sheetName)}`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    Logger.log(`Sheet "${sheetName}":`, data);
    return data;
  } catch (error) {
    Logger.log('Error fetching sheet:', error.toString());
  }
}

/**
 * Example: Fetch and display data
 */
function loadDormData() {
  // Get all sheets
  const allData = getAllSheets();
  
  // Or get a specific sheet
  // const sheetData = getSheet('Sheet1');
  
  // Process the data
  for (const [sheetName, rows] of Object.entries(allData)) {
    Logger.log(`\n=== ${sheetName} ===`);
    rows.forEach(row => {
      Logger.log(JSON.stringify(row));
    });
  }
}

// Test by running this function
function testClient() {
  loadDormData();
}
