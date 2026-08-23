# Complete Nursing Notes & Medical Revision Bundle (600+ Pages)

High-converting, mobile-optimized landing page for the **600+ Page Complete Nursing Notebook** built with **TanStack Start**, **React 19**, **Vite 8**, and **Tailwind CSS**.

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build
```

---

## 🌐 Hostinger Deployment Guide

This project is pre-configured with:
1. **Automated Static HTML Generation**: `npm run build` generates complete, pre-rendered static HTML in `.output/public`.
2. **High-Performance `.htaccess`**: Pre-configured in `public/.htaccess` with GZIP/Brotli compression, 1-year asset caching, and SPA query-preserving rewriting (`[QSA]`).

### Method A: Hostinger Git Deployment (Recommended)
1. Go to your **Hostinger hPanel** ➔ **Advanced** ➔ **GIT**.
2. Create repository:
   - **Repository URL**: `https://github.com/sarbajeetmohanty/mbbs.git`
   - **Branch**: `main`
   - **Install directory**: `/public_html` (or subdomain)
3. Set build command:
   ```bash
   npm install --legacy-peer-deps && npm run build && cp -r .output/public/* public_html/
   ```
4. Enable **Auto-Deploy Webhook** so any push to `main` instantly updates the live site.

### Method B: Manual File Upload
1. Run `npm run build` locally.
2. Upload the contents of `.output/public/` directly into your Hostinger **`public_html/`** folder via File Manager or FTP.

---

## 🛠️ Features Included

- 🎥 **Cloud Video Stream**: Streaming the original 600+ page notes preview video directly from CDN.
- ⚡ **Before & After Slider**: Interactive comparison slider between dense textbooks and visual nursing notes.
- 💳 **Indian Payment Badges**: Google Pay, PhonePe, Paytm, BHIM UPI, RuPay official vector badges.
- 🔔 **Live Social Proof Popups**: Verified purchase notifications cycling across Indian cities.
- 🎁 **Exit-Intent Recovery**: 10-minute countdown discount modal on desktop mouse-out & mobile back button.
- 💬 **WhatsApp Sales Closer Chat**: Interactive support assistant with dual-tone audio chime and instant answers.
- 🎯 **2026 Target Exam Syllabus**: Dedicated coverage for NORCET, ESIC, State CHO, GNM/B.Sc & NCLEX-RN.
