import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const serverPath = path.resolve(rootDir, ".output/server/index.mjs");
const publicDir = path.resolve(rootDir, ".output/public");

async function generateStaticHtml() {
  console.log("Generating static index.html for Hostinger public_html deployment...");

  try {
    const serverModule = await import(`file://${serverPath.replace(/\\/g, "/")}`);
    const handler = serverModule.default;

    if (!handler || typeof handler.fetch !== "function") {
      throw new Error("Server export does not contain a fetch handler.");
    }

    const request = new Request("http://localhost/");
    const env = {};
    const ctx = {
      waitUntil: () => {},
      passThroughOnException: () => {},
    };

    const response = await handler.fetch(request, env, ctx);

    if (!response.ok && response.status !== 200) {
      throw new Error(`Failed to render route: status ${response.status}`);
    }

    const html = await response.text();
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(path.resolve(publicDir, "index.html"), html, "utf-8");

    // Copy optimized .htaccess from public directory
    const sourceHtaccess = path.resolve(rootDir, "public/.htaccess");
    try {
      const htaccess = await fs.readFile(sourceHtaccess, "utf-8");
      await fs.writeFile(path.resolve(publicDir, ".htaccess"), htaccess, "utf-8");
    } catch {
      const htaccess = `<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteRule ^index\\.html$ - [L]\n  RewriteCond %{REQUEST_FILENAME} !-f\n  RewriteCond %{REQUEST_FILENAME} !-d\n  RewriteRule . /index.html [L,QSA]\n</IfModule>\n`;
      await fs.writeFile(path.resolve(publicDir, ".htaccess"), htaccess, "utf-8");
    }

    console.log("Successfully generated .output/public/index.html and .output/public/.htaccess!");
  } catch (err) {
    console.error("Static generation error:", err);
  }
}

generateStaticHtml();
