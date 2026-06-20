import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load server-side environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Expose configuration variables
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.VITE_SUPABASE_URL || "",
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || "",
    });
  });

  // Serve Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files but skip index.html index serving so get("*") can handle dynamic injection
    app.use(express.static(distPath, { index: false }));
    
    // Fallback for SPA routing to prevent 404 errors on direct path loads
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, "utf8");
          // Inject credentials as global variables at request-time so client can retrieve them immediately
          const configScript = `
  <script id="supabase-runtime-config">
    window.__SUPABASE_URL__ = ${JSON.stringify(process.env.VITE_SUPABASE_URL || "")};
    window.__SUPABASE_ANON_KEY__ = ${JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || "")};
  </script>`;
          if (html.includes("<head>")) {
            html = html.replace("<head>", `<head>${configScript}`);
          } else {
            html = configScript + html;
          }
          res.type("text/html").send(html);
        } else {
          res.sendStatus(404);
        }
      } catch (err) {
        console.error("Error reading or processing index.html in production:", err);
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
