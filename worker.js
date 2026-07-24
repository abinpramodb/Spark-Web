/**
 * Spark Web Cloudflare Edge Worker API
 * Handles all serverless endpoints and connects to D1 SQL database
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env) {
    // 1. Handle CORS preflight pre-requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // We accept requests routed by URL pathname or payload body actions for full backwards compatibility
      const url = new URL(request.url);
      let action = "";
      let payload = {};

      if (request.method === "POST") {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            payload = await request.json();
            action = payload.action;
          } catch (e) {}
        } else {
          try {
            const formData = await request.formData();
            payload = {};
            for (const [key, val] of formData.entries()) {
              payload[key] = val;
            }
          } catch (e) {}
        }
      }

      // Path-based route fallback
      if (!action) {
        action = url.pathname.replace(/^\/api\//, "").replace(/\/$/, "");
      }

      if (url.pathname.endsWith("/payhip-webhook")) {
        action = "payhip_webhook";
      }

      // Check D1 connection binding
      if (!env.DB) {
        return returnJson({ result: "error", error: "Database D1 binding missing in environment." }, 500);
      }

      // -------------------------------------------------------------
      // ROUTE: get_templates
      // -------------------------------------------------------------
      if (action === "get_templates") {
        const { results } = await env.DB.prepare("SELECT * FROM templates").all();
        return returnJson({ result: "success", templates: results });
      }

      // -------------------------------------------------------------
      // ROUTE: add_template
      // -------------------------------------------------------------
      else if (action === "add_template") {
        const id = "template-" + Date.now();
        const { name, category, description, thumbnail, demoPath, price, payhipUrl, figmaUrl, htmlCode, cssCode } = payload;

        if (!name || !category || !description || !demoPath) {
          return returnJson({ result: "error", error: "Missing required parameters to publish template." }, 400);
        }

        await env.DB.prepare(
          "INSERT INTO templates (id, name, category, description, thumbnail, demoPath, price, payhipUrl, figmaUrl, htmlCode, cssCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          id,
          name,
          category,
          description,
          thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          demoPath,
          price || "Free",
          payhipUrl || "",
          figmaUrl || "",
          htmlCode || "",
          cssCode || ""
        )
        .run();

        return returnJson({ result: "success", id: id });
      }

      // -------------------------------------------------------------
      // ROUTE: delete_template
      // -------------------------------------------------------------
      else if (action === "delete_template") {
        const id = payload.id;
        if (!id) {
          return returnJson({ result: "error", error: "Template ID is required for deletion." }, 400);
        }

        await env.DB.prepare("DELETE FROM templates WHERE id = ?").bind(id).run();
        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: edit_template
      // -------------------------------------------------------------
      else if (action === "edit_template") {
        const { id, name, category, description, thumbnail, demoPath, price, payhipUrl, figmaUrl, htmlCode, cssCode } = payload;
        if (!id || !name || !category || !description || !demoPath) {
          return returnJson({ result: "error", error: "Missing required parameters to update template." }, 400);
        }

        // Conditionally build UPDATE query based on whether code updates are sent
        let query = "UPDATE templates SET name = ?, category = ?, description = ?, thumbnail = ?, demoPath = ?, price = ?, payhipUrl = ?, figmaUrl = ?";
        let params = [
          name,
          category,
          description,
          thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          demoPath,
          price || "Free",
          payhipUrl || "",
          figmaUrl || ""
        ];

        if (htmlCode !== null && htmlCode !== undefined) {
          query += ", htmlCode = ?";
          params.push(htmlCode);
        }
        if (cssCode !== null && cssCode !== undefined) {
          query += ", cssCode = ?";
          params.push(cssCode);
        }

        query += " WHERE id = ?";
        params.push(id);

        await env.DB.prepare(query).bind(...params).run();
        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: preview (GET /api/preview?templateId=xxx)
      // -------------------------------------------------------------
      else if (action === "preview") {
        const templateId = url.searchParams.get("templateId");
        if (!templateId) {
          return new Response("Missing templateId parameter", { status: 400 });
        }

        const template = await env.DB.prepare("SELECT htmlCode, cssCode FROM templates WHERE id = ?").bind(templateId).first();
        if (!template) {
          return new Response("Template not found", { status: 404 });
        }

        const html = template.htmlCode || "<h1>No HTML layout code uploaded yet.</h1>";
        const css = template.cssCode || "";

        let finalHtml = html;
        if (css) {
          const headEnd = html.indexOf("</head>");
          if (headEnd !== -1) {
            finalHtml = html.substring(0, headEnd) + `\n  <style>\n${css}\n  </style>\n` + html.substring(headEnd);
          } else {
            finalHtml = `<style>\n${css}\n</style>\n` + html;
          }
        }

        return new Response(finalHtml, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          }
        });
      }

      // -------------------------------------------------------------
      // ROUTE: payhip_webhook
      // -------------------------------------------------------------
      else if (action === "payhip_webhook") {
        const email = (payload.email || "").toLowerCase().trim();
        const productCode = (payload.product_code || "").trim();

        if (!email || !productCode) {
          return returnJson({ result: "error", error: "Missing webhook parameters." }, 400);
        }

        const { results } = await env.DB.prepare("SELECT id FROM templates WHERE payhipUrl LIKE ?")
          .bind("%" + productCode + "%")
          .all();

        if (results.length === 0) {
          return returnJson({ result: "error", error: "No template mapped to product code: " + productCode }, 404);
        }

        const templateId = results[0].id;

        await env.DB.prepare(
          "INSERT OR IGNORE INTO purchases (email, templateId, purchaseDate) VALUES (?, ?, ?)"
        )
        .bind(email, templateId, new Date().toLocaleDateString())
        .run();

        await env.DB.prepare(
          "INSERT INTO builds (timestamp, email, templateId, fields) VALUES (?, ?, ?, ?)"
        )
        .bind(
          new Date().toLocaleString(),
          email,
          "PAYHIP PURCHASE: " + templateId,
          "{}"
        )
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: get_purchases
      // -------------------------------------------------------------
      else if (action === "get_purchases") {
        const email = payload.email ? payload.email.toLowerCase().trim() : "";
        if (!email) {
          return returnJson({ result: "error", error: "Email parameter is required." }, 400);
        }

        const { results } = await env.DB.prepare("SELECT templateId FROM purchases WHERE email = ?").bind(email).all();
        return returnJson({ result: "success", purchases: results.map(r => r.templateId) });
      }

      // -------------------------------------------------------------
      // ROUTE: record_purchase
      // -------------------------------------------------------------
      else if (action === "record_purchase") {
        const email = payload.email ? payload.email.toLowerCase().trim() : "";
        const templateId = payload.templateId;
        if (!email || !templateId) {
          return returnJson({ result: "error", error: "Missing required parameters to record purchase." }, 400);
        }

        await env.DB.prepare(
          "INSERT OR IGNORE INTO purchases (email, templateId, purchaseDate) VALUES (?, ?, ?)"
        )
        .bind(email, templateId, new Date().toLocaleDateString())
        .run();

        // Add an activity log entry for the purchase transaction
        await env.DB.prepare(
          "INSERT INTO builds (timestamp, email, templateId, fields) VALUES (?, ?, ?, ?)"
        )
        .bind(
          new Date().toLocaleString(),
          email,
          "PURCHASED: " + templateId,
          "{}"
        )
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: submit_upi_request
      // -------------------------------------------------------------
      else if (action === "submit_upi_request") {
        const { email, templateId, utr } = payload;
        if (!email || !templateId || !utr) {
          return returnJson({ result: "error", error: "Missing required parameters for UPI request." }, 400);
        }

        await env.DB.prepare(
          "INSERT INTO upi_requests (email, templateId, utr, timestamp, status) VALUES (?, ?, ?, ?, 'Pending Verification')"
        )
        .bind(email.toLowerCase().trim(), templateId, utr, new Date().toLocaleString())
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: approve_upi_request
      // -------------------------------------------------------------
      else if (action === "approve_upi_request") {
        const { id, email, templateId } = payload;
        if (!id || !email || !templateId) {
          return returnJson({ result: "error", error: "Missing parameters to approve UPI request." }, 400);
        }

        // 1. Mark request as Approved
        await env.DB.prepare("UPDATE upi_requests SET status = 'Approved' WHERE id = ?").bind(id).run();

        // 2. Add to purchases
        await env.DB.prepare(
          "INSERT OR IGNORE INTO purchases (email, templateId, purchaseDate) VALUES (?, ?, ?)"
        )
        .bind(email.toLowerCase().trim(), templateId, new Date().toLocaleDateString())
        .run();

        // 3. Log activity
        await env.DB.prepare(
          "INSERT INTO builds (timestamp, email, templateId, fields) VALUES (?, ?, ?, ?)"
        )
        .bind(new Date().toLocaleString(), email.toLowerCase().trim(), "UPI APPROVED: " + templateId, "{}")
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: reject_upi_request
      // -------------------------------------------------------------
      else if (action === "reject_upi_request") {
        const { id } = payload;
        if (!id) {
          return returnJson({ result: "error", error: "Missing UPI request ID." }, 400);
        }

        await env.DB.prepare("UPDATE upi_requests SET status = 'Rejected' WHERE id = ?").bind(id).run();
        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: save_build
      // -------------------------------------------------------------
      else if (action === "save_build") {
        const { generatedTime, email, templateId, fields } = payload;
        
        await env.DB.prepare(
          "INSERT INTO builds (timestamp, email, templateId, fields) VALUES (?, ?, ?, ?)"
        )
        .bind(
          generatedTime || new Date().toLocaleString(),
          email || "anonymous",
          templateId || "unknown",
          JSON.stringify(fields || {})
        )
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: get_admin_data
      // -------------------------------------------------------------
      else if (action === "get_admin_data") {
        // Fetch all data rows in parallel
        const requestsQuery = env.DB.prepare("SELECT * FROM access_requests").all();
        const verifiedQuery = env.DB.prepare("SELECT * FROM verified_emails").all();
        const buildsQuery = env.DB.prepare("SELECT * FROM builds ORDER BY id DESC LIMIT 20").all();
        const upiQuery = env.DB.prepare("SELECT * FROM upi_requests ORDER BY id DESC").all();

        const [requestsRes, verifiedRes, buildsRes, upiRes] = await Promise.all([
          requestsQuery,
          verifiedQuery,
          buildsQuery,
          upiQuery
        ]);

        return returnJson({
          result: "success",
          requests: requestsRes.results || [],
          verified: verifiedRes.results || [],
          upiRequests: upiRes.results || [],
          builds: (buildsRes.results || []).map(b => ({
            timestamp: b.timestamp,
            email: b.email,
            templateId: b.templateId
          }))
        });
      }

      // -------------------------------------------------------------
      // ROUTE: approve_request
      // -------------------------------------------------------------
      else if (action === "approve_request") {
        const email = payload.email ? payload.email.toLowerCase().trim() : "";
        if (!email) {
          return returnJson({ result: "error", error: "Email parameter is required." }, 400);
        }

        await env.DB.prepare(
          "INSERT OR IGNORE INTO verified_emails (email, verifiedDate) VALUES (?, ?)"
        )
        .bind(email, new Date().toLocaleDateString())
        .run();

        await env.DB.prepare(
          "UPDATE access_requests SET status = 'Approved' WHERE email = ?"
        )
        .bind(email)
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: deny_request
      // -------------------------------------------------------------
      else if (action === "deny_request") {
        const email = payload.email ? payload.email.toLowerCase().trim() : "";
        if (!email) {
          return returnJson({ result: "error", error: "Email parameter is required." }, 400);
        }

        await env.DB.prepare(
          "UPDATE access_requests SET status = 'Denied' WHERE email = ?"
        )
        .bind(email)
        .run();

        return returnJson({ result: "success" });
      }

      // -------------------------------------------------------------
      // ROUTE: send_otp (for compatibility testing)
      // -------------------------------------------------------------
      else if (action === "send_otp") {
        const email = payload.email ? payload.email.toLowerCase().trim() : "";
        if (!email) {
          return returnJson({ result: "error", error: "Email is required." }, 400);
        }

        // Verify if whitelisted
        const isVerified = await env.DB.prepare("SELECT email FROM verified_emails WHERE email = ?").bind(email).first();
        if (!isVerified) {
          // Add to pending access queue
          await env.DB.prepare(
            "INSERT OR IGNORE INTO access_requests (email, timestamp, status) VALUES (?, ?, 'Pending Approval')"
          )
          .bind(email, new Date().toLocaleString())
          .run();

          return returnJson({
            result: "error",
            error: "Access Denied: Email not whitelisted. Added to the approval queue. Please ask the sheet administrator to approve your account."
          });
        }

        // Return mock success code locally since OAuth is primary production method
        return returnJson({ result: "success", message: "OTP mock code generated successfully" });
      }

      else {
        return returnJson({ result: "error", error: "Invalid action or path endpoint not found: " + action }, 404);
      }

    } catch (err) {
      return returnJson({ result: "error", error: err.message }, 500);
    }
  }
};

function returnJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
