// Simple CORS version
export default {
  async fetch(request, env, ctx) {
    // Set CORS headers for all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "OK", message: "Server is running" }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (url.pathname === "/api/dictionary" && request.method === "GET") {
      const term = url.searchParams.get("term");
      if (!term) {
        return new Response(
          JSON.stringify({ error: "Term parameter is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      try {
        const response = await fetch(
          `https://api.langeek.co/v1/cs/en/word/?term=${encodeURIComponent(
            term
          )}&filter=,inCategory,photo,withExamples`
        );
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  },
};
