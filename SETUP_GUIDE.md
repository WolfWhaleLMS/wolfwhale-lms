# Wolf Whale LMS — Setup Guide (10-Minute Setup)

## What You Need Before Starting
- A computer (Mac or Windows)
- An email address
- That's it.

## STEP 1: Install Node.js (2 minutes)
1. Open your web browser
2. Go to https://nodejs.org
3. Click the big green button that says "LTS" (Long Term Support)
4. Open the downloaded file and follow the installer (just click Next/Continue through everything)
5. When it says "Installation Complete," you're done

**How to verify:**
- On Mac: Open "Terminal" (search for it in Spotlight)
- On Windows: Open "Command Prompt" or "PowerShell" (search in Start menu)
- Type: `node --version` and press Enter
- You should see something like `v22.x.x`

## STEP 2: Install Git (2 minutes)
1. Go to https://git-scm.com/downloads
2. Click your operating system (Mac or Windows)
3. Download and install (click through the defaults)

## STEP 3: Create Your Accounts (5 minutes)

### 3A: GitHub (code storage)
1. Go to https://github.com
2. Click "Sign up"
3. Follow the prompts (free account is fine)
4. Remember your username

### 3B: Supabase (database)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with your GitHub account (easiest)
4. Click "New Project"
5. Name it: `wolf-whale-lms`
6. Set a database password — SAVE THIS PASSWORD somewhere safe
7. Select region closest to you (e.g., "East US" or "Canada")
8. Click "Create new project"
9. Wait 1-2 minutes for it to set up
10. **Get your keys:** Go to Settings → API
    - Copy "Project URL" — this is your `NEXT_PUBLIC_SUPABASE_URL`
    - Copy "anon public" key — this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Copy "service_role secret" key — this is your `SUPABASE_SERVICE_ROLE_KEY`

### 3C: Vercel (hosting)
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with your GitHub account
4. Done — you'll connect your project later

## STEP 4: Set Up Your Database (3 minutes)
1. In Supabase, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `supabase/migrations/00001_initial_schema.sql` from your wolf-whale-lms folder
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click "Run" (the green play button)
7. You should see "Success. No rows returned" — that means it worked!
8. Now do the same with `supabase/seed.sql` — this loads demo data

## STEP 5: Configure Your Project (2 minutes)
1. Open the `wolf-whale-lms` folder on your computer
2. Find the file called `.env.local`
3. Open it with any text editor (Notepad, TextEdit, VS Code)
4. Replace the placeholder values with your real keys from Step 3:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...YOUR-ANON-KEY-HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...YOUR-SERVICE-ROLE-KEY-HERE

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Save the file

## STEP 6: Install & Run (2 minutes)
1. Open Terminal (Mac) or Command Prompt (Windows)
2. Navigate to your project folder. Type:
   ```
   cd path/to/wolf-whale-lms
   ```
   (Replace "path/to" with the actual path. On Mac you can drag the folder onto the Terminal to get the path.)

3. Install all dependencies:
   ```
   npm install
   ```
   This will take 1-2 minutes. You'll see a progress bar. When it says "added XXX packages," you're done.

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to: **http://localhost:3000**

6. You should see the Wolf Whale LMS login page!

## STEP 7: Log In with Demo Data
The seed data created a demo school called "Riverside Academy" with these test accounts:

| Role | Email | Notes |
|------|-------|-------|
| Admin | admin@riverside.edu | School administrator |
| Teacher | sarah.chen@riverside.edu | Math teacher |
| Teacher | marcus.johnson@riverside.edu | English teacher |
| Student | alex.w@riverside.edu | Grade 8 student |
| Student | emma.r@riverside.edu | Grade 10 student |
| Parent | jennifer.w@riverside.edu | Alex's parent |

**Note:** Since these are Supabase Auth users, you'll need to create them through the registration page first, OR create them in Supabase Dashboard → Authentication → Users. Use any password you want for testing.

### Quick way to create test users:
1. In Supabase, go to Authentication → Users
2. Click "Add User" → "Create User"
3. Enter email (from table above) and a password
4. The user_profiles are already in the database from the seed data

## STEP 8: Deploy to the Internet (Optional, 3 minutes)
1. Initialize git in your project:
   ```
   cd wolf-whale-lms
   git init
   git add .
   git commit -m "Initial commit - Wolf Whale LMS"
   ```
2. Create a new repository on GitHub (github.com → New Repository → name it "wolf-whale-lms")
3. Push your code:
   ```
   git remote add origin https://github.com/YOUR-USERNAME/wolf-whale-lms.git
   git push -u origin main
   ```
4. Go to vercel.com → "Add New Project"
5. Import your GitHub repository
6. Add your environment variables (same ones from .env.local)
7. Click "Deploy"
8. In 2-3 minutes, your LMS will be live at `wolf-whale-lms.vercel.app`!

## Troubleshooting

**"command not found: node"**
→ Node.js didn't install properly. Re-download from nodejs.org and try again. On Mac, you might need to close and reopen Terminal.

**"command not found: npm"**
→ npm comes with Node.js. Reinstall Node.js.

**npm install errors**
→ Try: `npm install --legacy-peer-deps`

**"NEXT_PUBLIC_SUPABASE_URL is not set"**
→ Your .env.local file isn't configured. Make sure you saved it in the root wolf-whale-lms folder (not a subfolder).

**Blank page at localhost:3000**
→ Check the terminal for error messages. Most likely a missing environment variable.

**"relation does not exist" errors**
→ The SQL migration didn't run. Go back to Step 4 and run the migration SQL in Supabase.

**Port 3000 already in use**
→ Something else is running on port 3000. Either close it, or start Wolf Whale on a different port: `npm run dev -- --port 3001`

## Need Help?
If you get stuck, copy the error message from your terminal and share it — most issues are quick fixes related to environment variables or missing the database migration step.

---

Done! Your Wolf Whale LMS should now be running. The next step is to customize it, add your school's branding, and invite your first users.
