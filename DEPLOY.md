# Deploying sempy to Vercel

1. Install Node.js 20 or newer (the macOS installer from https://nodejs.org). Check with `node -v` in Terminal.
2. Unzip the file (double-click it). Open the Terminal app (Cmd+Space, type "Terminal"), type `cd ` (with a space), drag the unzipped WORKSHOP folder into the Terminal window, and press Enter.
3. Run:  `npm install`  (once, takes a minute)
4. Optional test:  `npm run build`
5. Run:  `npx vercel`  — it opens the browser to log in to Vercel. Say yes to "Set up and deploy", create a new project.
6. In the Vercel dashboard → your project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SITE_URL` = your live URL, e.g. https://your-project.vercel.app  (used for the download links in emails)
   - `OPENROUTER_API_KEY` = your key (optional; without it a built-in FAQ answers the support chat). Never put keys in code.
   - `RESEND_API_KEY` and `EMAIL_FROM` (optional; without them emails are simulated)
   - `ORDER_NOTIFICATION_EMAIL` = the address that should get order notifications
7. Run:  `npx vercel --prod`  to publish with those variables.

Notes: checkout is a demo (no real payments); reviews are labeled sample content; template download links are public URLs.
