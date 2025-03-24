# Zapwiser Newsletter Setup Guide

This guide provides instructions for setting up your weekly newsletter subscription system using Google Sheets - a simple, free solution for collecting and managing subscriber emails.

## Setting Up Google Sheets Integration

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it "Zapwiser Newsletter Subscribers".
3. Set up the following headers in row 1:
   - Column A: "First Name"
   - Column B: "Last Name"
   - Column C: "Email"
   - Column D: "Timestamp"
   - Column E: "Source" (optional - tracks where subscribers signed up)

### Step 2: Create a Google Apps Script

1. In your Google Sheet, click on Extensions > Apps Script.
2. Delete any code in the editor and paste the following code:

```javascript
// Handle direct browser access with GET requests
function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <html>
      <head>
        <title>Zapwiser Newsletter Service</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 30px;
            border: 1px solid #eee;
            border-radius: 5px;
            margin-top: 50px;
          }
          h1 {
            color: #1a4971;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Zapwiser Newsletter Service</h1>
          <p>This is the backend service for the Zapwiser newsletter subscription system.</p>
          <p>To subscribe to our newsletter, please visit <a href="https://zapwiser.com">our website</a>.</p>
        </div>
      </body>
    </html>
  `);
}

// Handle POST requests from the website form submissions
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // Get form data
    const data = e.parameter;
    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    const email = data.email;
    const timestamp = data.timestamp || new Date().toISOString();
    const source = data.source || 'Website';
    
    // Check if email already exists to prevent duplicates
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][2] === email) {
        return ContentService.createTextOutput(JSON.stringify({
          result: 'error',
          message: 'Email already exists'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add new subscriber
    sheet.appendRow([firstName, lastName, email, timestamp, source]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Subscription successful'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click on Save (name it "Newsletter Form Handler").

### Step 3: Deploy the Web App

1. Click on Deploy > New deployment.
2. Select type: Web app.
3. Enter the following details:
   - Description: "Newsletter Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click Deploy.
5. Copy the Web app URL that appears (you'll need this for your website).

### Current Deployment Details

- Deployment ID: `AKfycby0eB-cOvSSGFUCYD1KB5htufyzPyZt01Ldj7M7kM83s__etg0d8l00ghPATimujieH`
- Web App URL: `https://script.google.com/macros/s/AKfycby0eB-cOvSSGFUCYD1KB5htufyzPyZt01Ldj7M7kM83s__etg0d8l00ghPATimujieH/exec`

### Step 4: Update Your Website

1. Open the file `assets/js/google-sheet-integration.js`.
2. Replace `YOUR_GOOGLE_SCRIPT_URL` with the URL you copied in Step 3.
3. Add the script to your HTML files by adding this line before the closing `</body>` tag:

```html
<script src="assets/js/google-sheet-integration.js"></script>
```

## Sending Weekly Newsletters

Once you have collected subscriber emails in your Google Sheet:

1. Export your subscriber list from Google Sheets as CSV.
2. Use an email service like Gmail (with BCC for small lists) or an email service provider for larger lists.
3. Make sure to include an unsubscribe link in all your emails for compliance with email regulations.

## Tips for Email Management

- Keep your emails consistent (weekly as promised).
- Use a professional email address (like [newsletter@zapwiser.com](mailto:newsletter@zapwiser.com)).
- Make sure your email content is mobile-friendly.
- Always provide valuable content to keep subscribers engaged.

---

For any questions or further customizations, please contact your web developer.
