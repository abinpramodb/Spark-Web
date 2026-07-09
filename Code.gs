/**
 * Serverless Apps Script Endpoint System Entry Core
 * Handles POST requests from Spark Web for:
 * 1. OTP Email Generation & Dispatch ("send_otp")
 * 2. OTP Verification ("verify_otp")
 * 3. Configuration & Template Syncing ("save_build")
 */
function doPost(e) {
  // Set CORS headers for cross-origin access
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action || "save_build"; // fallback to default save

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // -------------------------------------------------------------
    // ACTION 1: Generate and Send OTP Email
    // -------------------------------------------------------------
    if (action === "send_otp") {
      var email = requestData.email;
      if (!email) {
        throw new Error("Email parameter is required.");
      }

      var targetEmail = email.toLowerCase().trim();

      // Generate secure 6-digit OTP code
      var otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      var timestamp = new Date().getTime();

      // Retrieve or create 'OTP_Auth' sheet tab
      var otpSheet = spreadsheet.getSheetByName("OTP_Auth");
      if (!otpSheet) {
        otpSheet = spreadsheet.insertSheet("OTP_Auth");
        otpSheet.appendRow(["Email", "OTP Code", "Timestamp", "Verified"]);
      }

      // Record OTP details
      otpSheet.appendRow([targetEmail, otpCode, timestamp, "false"]);

      // Send actual email using Google's Mail API
      MailApp.sendEmail({
        to: targetEmail,
        subject: "🔑 Your Spark Web Login Code: " + otpCode,
        htmlBody: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; margin: 0 auto; background-color: #ffffff;">
            <h2 style="color: #6366f1; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.5px;">Spark Web</h2>
            <p style="color: #475569; font-size: 15px; margin-bottom: 24px;">Please use the one-time authentication code below to log in to your account.</p>
            <div style="background: #f1f5f9; padding: 18px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 6px; text-align: center; color: #0f172a; margin: 24px 0; border: 1px solid #e2e8f0;">
              ${otpCode}
            </div>
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">This code is active for 10 minutes. If you did not initiate this authentication request, you can safely disregard this email.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #cbd5e1; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 Spark Web. Serverless Auth Stack.</p>
          </div>
        `
      });

      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "OTP sent successfully" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // ACTION 2: Verify OTP Code
    // -------------------------------------------------------------
    else if (action === "verify_otp") {
      var email = requestData.email;
      var submittedOtp = requestData.otp;

      if (!email || !submittedOtp) {
        throw new Error("Email and OTP are required.");
      }

      var otpSheet = spreadsheet.getSheetByName("OTP_Auth");
      if (!otpSheet) {
        throw new Error("No authentication ledger found. Please request an OTP first.");
      }

      var dataRange = otpSheet.getDataRange();
      var values = dataRange.getValues();
      var verified = false;
      var now = new Date().getTime();
      var tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

      // Search rows from newest to oldest (excluding header)
      for (var i = values.length - 1; i >= 1; i--) {
        var rowEmail = values[i][0];
        var rowOtp = values[i][1].toString();
        var rowTimestamp = Number(values[i][2]);
        var rowVerified = values[i][3].toString();

        if (rowEmail === email && rowOtp === submittedOtp && rowVerified === "false") {
          // Check expiration
          if (now - rowTimestamp <= tenMinutes) {
            verified = true;
            // Mark as verified to prevent reuse
            otpSheet.getRange(i + 1, 4).setValue("true");
            break;
          }
        }
      }

      if (verified) {
        // Return a mock token for frontend storage
        var sessionToken = Utilities.base64Encode(JSON.stringify({ email: email, loginTime: now }));
        return ContentService.createTextOutput(JSON.stringify({ "result": "success", "token": sessionToken }))
                             .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": "Invalid or expired verification code." }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // -------------------------------------------------------------
    // ACTION 3: Save Customized Template config (original doPost)
    // -------------------------------------------------------------
    else if (action === "save_build") {
      var activeSheet = spreadsheet.getSheetByName("Builds") || spreadsheet.getActiveSheet();
      
      activeSheet.appendRow([
        requestData.generatedTime,
        requestData.email || "anonymous",
        requestData.templateId,
        JSON.stringify(requestData.fields)
      ]);
      
      // Save configuration file to Drive
      var directoryName = "TemplateMarketplace_User_Builds";
      var trackingDirectories = DriveApp.getFoldersByName(directoryName);
      var targetFolder;
      
      if (trackingDirectories.hasNext()) {
        targetFolder = trackingDirectories.next();
      } else {
        targetFolder = DriveApp.createFolder(directoryName);
      }
      
      var uniqueID = "customer_build_" + requestData.templateId + "_" + new Date().getTime() + ".json";
      targetFolder.createFile(uniqueID, JSON.stringify(requestData, null, 2), MimeType.PLAIN_TEXT);
      
      return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    else {
      throw new Error("Unsupported actions parameter.");
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
