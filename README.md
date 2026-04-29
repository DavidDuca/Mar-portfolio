# Marissa — Portfolio

Static portfolio site with a Vercel Serverless Function that sends contact-form emails via Gmail + Nodemailer.

## Stack
- Static HTML / CSS / JS (no build step)
- `/api/contact.js` — Vercel Node Serverless Function

## Local development
```bash
npm install
npm run dev      # runs `vercel dev` on http://localhost:3000
```

## Environment variables
Set these in **Vercel → Project → Settings → Environment Variables** (and locally in `.env`):

| Name | Description |
|------|-------------|
| `EMAIL_USER` | Gmail address used to send mail |
| `EMAIL_PASS` | Google **App Password** (16 chars, no spaces) |
| `EMAIL_TO`   | Recipient address (defaults to `EMAIL_USER`) |

See `.env.example`.

## Deploy
```bash
npx vercel        # first-time link
npm run deploy    # production deploy
```
Or push to GitHub and import the repo in the Vercel dashboard — it will auto-detect the static site and the `api/` function.

## Project structure
```
.
├── api/contact.js     # Serverless function (Nodemailer)
├── assets/            # Images, video
├── css/style.css
├── js/main.js
├── index.html
├── package.json
└── vercel.json
```
