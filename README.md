# Spark Web: 100% Free HTML Template Marketplace Setup Guide

This comprehensive blueprint outlines the file configurations, directories, and serverless backend architecture needed to build a completely free, professional-grade website template store. 

## ⚙️ Architecture & Free Cloud Tech Stack
* **Front-End Hosting (Free):** [GitHub Pages](https://pages.github.com/) (Zero-cost server hosting with high global availability).
* **Cloud Storage & File Database (Free):** [Google Drive](https://drive.google.com/) (Maintains customizer JSON recovery setups and static file exports).
* **Relational Transactional Logging (Free):** [Google Sheets](https://sheets.google.com/) (Tracks user updates, time arrays, and custom configurations).
* **API Layer / Web Server (Free):** [Google Apps Script](https://script.google.com/) (Handles secure POST requests without traditional servers).

---

## 📂 Complete File Directory Map
Create these folders and files exactly as structured below in your code workspace before publishing:

```text
free-marketplace/
├── assets/
│   ├── css/
│   │   └── variables.css      <-- Design design tokens and color roots
├── templates/
│   └── live-editor.html       <-- Interactive layout live workspace UI
├── previews/                  <-- Sandboxed raw code templates folder
│   └── template-1/
│       ├── index.html         <-- Base mock HTML layout for your template
│       └── style.css          <-- Custom styles matching template-1
├── index.html                 <-- Primary customer-facing store dashboard
```

---

## 🌐 1. Main Marketplace Interface (`index.html`)

Save this code to the root level of your project directory. This acts as your professional homepage.

(Refer to `index.html` in the repository for the implementation.)

---

## 🎨 2. Universal Global Styling CSS (`assets/css/variables.css`)

Saves global variables so that themes stay uniform across layout windows.

(Refer to `assets/css/variables.css` in the repository for the implementation.)

---

## 🛠️ 3. Interactive Customizer Workspace View (`templates/live-editor.html`)

The engine panel where buyers edit content blocks and upload configurations straight to your Google Drive.

(Refer to `templates/live-editor.html` in the repository for the implementation.)

---

## 📂 4. Sample Raw View Target Template (`previews/template-1/index.html`)

Save this template into your subfolder. The visual customizer loads this file inside its iframe window and targets the `template-headline` ID.

(Refer to `previews/template-1/index.html` in the repository for the implementation.)

---

## ⚡ 5. Google Drive Serverless Database Backend (`Code.gs`)

Create a new script file inside [script.google.com](https://script.google.com) and deploy it to process and save custom workspace settings.

```javascript
/**
 * Serverless Apps Script Endpoint System Entry Core
 * Handles POST requests from Spark Web for:
 * 1. OTP Email Generation & Dispatch ("send_otp")
 * 2. OTP Verification ("verify_otp")
 * 3. Configuration & Template Syncing ("save_build")
 */
function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action || "save_build";

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "send_otp") {
      var email = requestData.email;
      if (!email) throw new Error("Email parameter is required.");

      var otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      var timestamp = new Date().getTime();

      var otpSheet = spreadsheet.getSheetByName("OTP_Auth");
      if (!otpSheet) {
        otpSheet = spreadsheet.insertSheet("OTP_Auth");
        otpSheet.appendRow(["Email", "OTP Code", "Timestamp", "Verified"]);
      }
      otpSheet.appendRow([email, otpCode, timestamp, "false"]);

      MailApp.sendEmail({
        to: email,
        subject: "🔑 Your Spark Web Login Code: " + otpCode,
        htmlBody: `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #6366f1; margin-bottom: 8px;">Spark Web</h2>
            <p>Your one-time authentication login code is:</p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #0f172a; margin: 20px 0; border: 1px solid #e2e8f0;">
              ${otpCode}
            </div>
            <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes.</p>
          </div>
        `
      });

      return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    else if (action === "verify_otp") {
      var email = requestData.email;
      var submittedOtp = requestData.otp;

      var otpSheet = spreadsheet.getSheetByName("OTP_Auth");
      if (!otpSheet) throw new Error("No auth ledger found.");

      var dataRange = otpSheet.getDataRange();
      var values = dataRange.getValues();
      var verified = false;
      var now = new Date().getTime();

      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === email && values[i][1].toString() === submittedOtp && values[i][3].toString() === "false") {
          if (now - Number(values[i][2]) <= 10 * 60 * 1000) {
            verified = true;
            otpSheet.getRange(i + 1, 4).setValue("true");
            break;
          }
        }
      }

      if (verified) {
        var sessionToken = Utilities.base64Encode(JSON.stringify({ email: email, loginTime: now }));
        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "token": sessionToken }))
                             .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": "Invalid or expired code." }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }

    else if (action === "save_build") {
      var activeSheet = spreadsheet.getSheetByName("Builds") || spreadsheet.getActiveSheet();
      activeSheet.appendRow([
        requestData.generatedTime,
        requestData.email || "anonymous",
        requestData.templateId,
        JSON.stringify(requestData.fields)
      ]);
      
      var directoryName = "TemplateMarketplace_User_Builds";
      var trackingDirectories = DriveApp.getFoldersByName(directoryName);
      var targetFolder = trackingDirectories.hasNext() ? trackingDirectories.next() : DriveApp.createFolder(directoryName);
      
      var uniqueID = "customer_build_" + requestData.templateId + "_" + new Date().getTime() + ".json";
      targetFolder.createFile(uniqueID, JSON.stringify(requestData, null, 2), MimeType.PLAIN_TEXT);
      
      return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🚀 Step-by-Step Launch & Deployment Guide

1. **Google Sheets Config:** Create a new empty [Google Sheet](https://sheets.new). Select **Extensions** > **Apps Script**, clear any boilerplate, paste the **`Code.gs`** script block from above, and save.
2. **Deploy the API Web App:** Inside the Apps Script editor panel, click **Deploy** > **New Deployment**. Select **Web App**. Execute as **Me (your email address)**, change access setting visibility to **Anyone**, and hit deploy. Copy the generated **Web App URL**.
3. **Connect the Front-End Engine:** Open `templates/live-editor.html` and replace the placeholder text string in `WEB_APP_ENDPOINT` with your copied Web App URL link.
4. **Publish Free via GitHub Pages:** Create a public project repository on GitHub. Push your local site files containing your exact file layout structure. Navigate over to repository **Settings** > **Pages**, select your `main` branch configuration source directory, and click **Save**. Your marketplace is live!
