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

    // -------------------------------------------------------------
    // ACTION 4: Get All Templates
    // -------------------------------------------------------------
    else if (action === "get_templates") {
      var templatesSheet = spreadsheet.getSheetByName("Marketplace_Templates");
      var templates = [];
      if (templatesSheet) {
        var values = templatesSheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          templates.push({
            id: values[i][0],
            name: values[i][1],
            category: values[i][2],
            description: values[i][3],
            thumbnail: values[i][4],
            demoPath: values[i][5],
            price: values[i][6]
          });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "templates": templates }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION 5: Add Template
    // -------------------------------------------------------------
    else if (action === "add_template") {
      var templatesSheet = spreadsheet.getSheetByName("Marketplace_Templates");
      if (!templatesSheet) {
        templatesSheet = spreadsheet.insertSheet("Marketplace_Templates");
        templatesSheet.appendRow(["ID", "Name", "Category", "Description", "Thumbnail URL", "Demo Path", "Price"]);
      }
      var newId = "template-" + new Date().getTime();
      templatesSheet.appendRow([
        newId,
        requestData.name,
        requestData.category,
        requestData.description,
        requestData.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        requestData.demoPath || "template-1",
        requestData.price || "Free"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "id": newId }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION 6: Delete Template
    // -------------------------------------------------------------
    else if (action === "delete_template") {
      var templatesSheet = spreadsheet.getSheetByName("Marketplace_Templates");
      var idToDelete = requestData.id;
      if (templatesSheet && idToDelete) {
        var values = templatesSheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          if (values[i][0] === idToDelete) {
            templatesSheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION 7: Get Admin Dashboard Data
    // -------------------------------------------------------------
    else if (action === "get_admin_data") {
      // 1. Fetch access requests
      var requestSheet = spreadsheet.getSheetByName("Access_Requests");
      var requests = [];
      if (requestSheet) {
        var values = requestSheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          requests.push({
            email: values[i][0],
            timestamp: values[i][1],
            status: values[i][2]
          });
        }
      }

      // 2. Fetch whitelisted / verified emails
      var whitelistSheet = spreadsheet.getSheetByName("Verified_Emails");
      var verified = [];
      if (whitelistSheet) {
        var values = whitelistSheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          verified.push({
            email: values[i][0],
            date: values[i][1]
          });
        }
      }

      // 3. Fetch activity log (Builds)
      var buildsSheet = spreadsheet.getSheetByName("Builds");
      var builds = [];
      if (buildsSheet) {
        var values = buildsSheet.getDataRange().getValues();
        for (var i = Math.max(1, values.length - 20); i < values.length; i++) {
          builds.push({
            timestamp: values[i][0],
            email: values[i][1],
            templateId: values[i][2]
          });
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        "result": "success",
        "requests": requests,
        "verified": verified,
        "builds": builds.reverse()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION 8: Approve Whitelist Access Request
    // -------------------------------------------------------------
    else if (action === "approve_request") {
      var emailToApprove = requestData.email.toLowerCase().trim();
      
      var whitelistSheet = spreadsheet.getSheetByName("Verified_Emails");
      if (!whitelistSheet) {
        whitelistSheet = spreadsheet.insertSheet("Verified_Emails");
        whitelistSheet.appendRow(["Email", "Verified Date"]);
      }
      
      var wlValues = whitelistSheet.getDataRange().getValues();
      var alreadyWhitelisted = false;
      for (var r = 1; r < wlValues.length; r++) {
        if (wlValues[r][0].toString().toLowerCase().trim() === emailToApprove) {
          alreadyWhitelisted = true;
          break;
        }
      }
      if (!alreadyWhitelisted) {
        whitelistSheet.appendRow([emailToApprove, new Date().toLocaleString()]);
      }

      var requestSheet = spreadsheet.getSheetByName("Access_Requests");
      if (requestSheet) {
        var reqValues = requestSheet.getDataRange().getValues();
        for (var i = 1; i < reqValues.length; i++) {
          if (reqValues[i][0].toString().toLowerCase().trim() === emailToApprove) {
            requestSheet.getRange(i + 1, 3).setValue("Approved");
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION 9: Deny Whitelist Access Request
    // -------------------------------------------------------------
    else if (action === "deny_request") {
      var emailToDeny = requestData.email.toLowerCase().trim();
      var requestSheet = spreadsheet.getSheetByName("Access_Requests");
      if (requestSheet) {
        var reqValues = requestSheet.getDataRange().getValues();
        for (var i = 1; i < reqValues.length; i++) {
          if (reqValues[i][0].toString().toLowerCase().trim() === emailToDeny) {
            requestSheet.getRange(i + 1, 3).setValue("Denied");
            break;
          }
        }
      }
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
