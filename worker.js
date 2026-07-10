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
        try {
          payload = await request.json();
          action = payload.action;
        } catch (e) {
          // JSON parsing failed, check query params instead
        }
      }

      // Path-based route fallback
      if (!action) {
        action = url.pathname.replace(/^\/api\//, "").replace(/\/$/, "");
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
        const { name, category, description, thumbnail, demoPath, price } = payload;

        if (!name || !category || !description || !demoPath) {
          return returnJson({ result: "error", error: "Missing required parameters to publish template." }, 400);
        }

        await env.DB.prepare(
          "INSERT INTO templates (id, name, category, description, thumbnail, demoPath, price) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          id,
          name,
          category,
          description,
          thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          demoPath,
          price || "Free"
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
        const { id, name, category, description, thumbnail, demoPath, price } = payload;
        if (!id || !name || !category || !description || !demoPath) {
          return returnJson({ result: "error", error: "Missing required parameters to update template." }, 400);
        }

        await env.DB.prepare(
          "UPDATE templates SET name = ?, category = ?, description = ?, thumbnail = ?, demoPath = ?, price = ? WHERE id = ?"
        )
        .bind(
          name,
          category,
          description,
          thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          demoPath,
          price || "Free",
          id
        )
        .run();

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

        const [requestsRes, verifiedRes, buildsRes] = await Promise.all([
          requestsQuery,
          verifiedQuery,
          buildsQuery
        ]);

        return returnJson({
          result: "success",
          requests: requestsRes.results || [],
          verified: verifiedRes.results || [],
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
