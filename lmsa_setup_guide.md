# LMSA PROJECT - COMPLETE SETUP GUIDE
**Get Started in 15 Minutes**

---

## 📁 PROJECT ORGANIZATION

Your complete LMSA project should have this structure:

```
lmsa-project/
├── lmsa-website/          # Frontend repository
├── lmsa-api/              # Backend repository
└── docs/                  # Shared documentation
    ├── 01-brand-identity-design-system.md
    ├── 02-tech-stack-analysis.md
    ├── 03-technical-documentation.md
    ├── 04-database-schema.sql
    ├── 05-development-roadmap.md
    └── README.md
```

---

## 🚀 SPRINT 1 SETUP - STEP BY STEP

### **Step 1: Create Project Folder**

```bash
# Create main project folder
mkdir lmsa-project
cd lmsa-project

# Create docs folder
mkdir docs
```

---

### **Step 2: Setup Frontend (lmsa-website)**

```bash
# Create frontend project
npm create vite@latest lmsa-website -- --template react
cd lmsa-website

# Install dependencies
npm install react-router-dom @supabase/supabase-js axios date-fns react-hook-form zod lucide-react react-hot-toast framer-motion

# Install dev dependencies
npm install -D tailwindcss autoprefixer postcss eslint eslint-plugin-react eslint-plugin-react-hooks prettier

# Initialize Tailwind CSS
npx tailwindcss init -p
```

**Now copy all the frontend files from the first artifact into the `lmsa-website` folder:**
- Replace `package.json` with the one provided
- Create all folders: `src/components`, `src/pages`, `src/services`, etc.
- Copy all component files
- Copy configuration files (`.eslintrc.json`, `.prettierrc`, `tailwind.config.js`)

```bash
# Create environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
nano .env
```

**Test frontend:**
```bash
npm run dev
# Should open at http://localhost:5173
```

---

### **Step 3: Setup Backend (lmsa-api)**

```bash
# Go back to main project folder
cd ..

# Create backend folder
mkdir lmsa-api
cd lmsa-api

# Initialize npm project
npm init -y

# Install dependencies
npm install express cors helmet dotenv @supabase/supabase-js express-validator multer nodemailer bcrypt jsonwebtoken express-rate-limit compression

# Install dev dependencies
npm install -D nodemon eslint prettier
```

**Now copy all the backend files from the second artifact into the `lmsa-api` folder:**
- Replace `package.json` with the one provided
- Create all folders: `src/routes`, `src/controllers`, `src/middleware`, etc.
- Copy all route and controller files
- Copy configuration files

```bash
# Create environment file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

**Test backend:**
```bash
npm run dev
# Should run at http://localhost:5000
```

---

### **Step 4: Setup Supabase Database**

1. **Go to https://supabase.com**
2. **Create a new project:**
   - Project name: `lmsa-production`
   - Database password: (save this securely)
   - Region: Choose closest to Liberia (or US East)

3. **Get your credentials:**
   - Go to Settings → API
   - Copy `Project URL` → Put in both `.env` files as `SUPABASE_URL`
   - Copy `anon public` key → Put as `SUPABASE_ANON_KEY`
   - Copy `service_role` key → Put in backend `.env` as `SUPABASE_SERVICE_KEY`

4. **Run database schema:**
   - Go to SQL Editor in Supabase dashboard
   - Copy the entire database schema from the Technical Documentation
   - Paste and run it
   - Verify tables were created (should see ~15 tables)

5. **Enable Email Auth:**
   - Go to Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)

---

### **Step 5: Setup Email (Gmail)**

1. **Create a Gmail account** for LMSA (e.g., `lmsa.official@gmail.com`)

2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification (enable it)
   - Security → App Passwords
   - Generate new app password for "Mail"
   - Copy the 16-character password

3. **Add to backend `.env`:**
   ```
   EMAIL_USER=lmsa.official@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

---

### **Step 6: Add Documentation**

```bash
# Go back to main project folder
cd ..

# Create docs folder if you haven't
mkdir docs
cd docs
```

**Create these files in the `docs` folder:**

1. **`01-brand-identity-design-system.md`**
   - Copy the Brand Identity & Design System document

2. **`02-tech-stack-analysis.md`**
   - Copy the Tech Stack Analysis document

3. **`03-technical-documentation.md`**
   - Copy the Complete Technical Documentation

4. **`04-database-schema.sql`**
   - Copy just the SQL schema section from technical docs

5. **`05-development-roadmap.md`**
   - Copy the Development Roadmap & Sprint Planning

6. **`README.md`**
   ```markdown
   # LMSA Project Documentation
   
   Complete documentation for the LMSA website project.
   
   ## Documents
   
   1. [Brand Identity & Design System](01-brand-identity-design-system.md)
   2. [Tech Stack Analysis](02-tech-stack-analysis.md)
   3. [Technical Documentation](03-technical-documentation.md)
   4. [Database Schema](04-database-schema.sql)
   5. [Development Roadmap](05-development-roadmap.md)
   
   ## Quick Links
   
   - Frontend: `../lmsa-website`
   - Backend: `../lmsa-api`
   ```

---

### **Step 7: Initialize Git Repositories**

**Frontend:**
```bash
cd ../lmsa-website

# Initialize git
git init

# Create .gitignore (already provided)

# Initial commit
git add .
git commit -m "Initial frontend setup - Sprint 1"

# Connect to GitHub (create repo first on github.com)
git remote add origin https://github.com/your-org/lmsa-website.git
git branch -M main
git push -u origin main
```

**Backend:**
```bash
cd ../lmsa-api

# Initialize git
git init

# Create .gitignore (already provided)

# Initial commit
git add .
git commit -m "Initial backend setup - Sprint 1"

# Connect to GitHub
git remote add origin https://github.com/your-org/lmsa-api.git
git branch -M main
git push -u origin main
```

---

### **Step 8: Deploy to Staging**

#### **Deploy Frontend to Vercel:**

1. **Go to https://vercel.com**
2. **Click "Add New Project"**
3. **Import `lmsa-website` repository**
4. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables:**
   - `VITE_API_URL`: (will update after backend deploy)
   - `VITE_SUPABASE_URL`: your supabase URL
   - `VITE_SUPABASE_ANON_KEY`: your anon key
   - `VITE_APP_NAME`: LMSA
   - `VITE_APP_URL`: (auto-generated by Vercel)
6. **Deploy!**

#### **Deploy Backend to Render:**

1. **Go to https://render.com**
2. **Click "New +" → "Web Service"**
3. **Connect `lmsa-api` repository**
4. **Configure:**
   - Name: `lmsa-api`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables:** (copy all from your `.env`)
6. **Select Plan:** Free
7. **Create Web Service**
8. **Copy the deployed URL** (e.g., `https://lmsa-api.onrender.com`)

#### **Update Frontend Environment:**

Go back to Vercel → Settings → Environment Variables:
- Update `VITE_API_URL` to `https://lmsa-api.onrender.com/api`
- Redeploy

#### **Update Backend CORS:**

In Render → Environment:
- Update `FRONTEND_URL` to your Vercel URL
- Redeploy

---

## ✅ SPRINT 1 CHECKLIST

After completing all steps, verify:

### **Frontend:**
- [ ] `npm run dev` works locally
- [ ] Tailwind CSS styles applied
- [ ] Routes working (/, /about, /login, /register)
- [ ] Header and Footer visible
- [ ] No console errors
- [ ] Deployed to Vercel staging

### **Backend:**
- [ ] `npm run dev` works locally
- [ ] Health endpoint works: `http://localhost:5000/api/health`
- [ ] CORS configured correctly
- [ ] Email service connected
- [ ] Database connection working
- [ ] Deployed to Render staging

### **Supabase:**
- [ ] All tables created
- [ ] RLS policies enabled
- [ ] Email auth enabled
- [ ] Credentials added to both apps

### **Documentation:**
- [ ] All 5 docs in `/docs` folder
- [ ] README.md created
- [ ] Both repos have proper README

### **Git:**
- [ ] Both repos on GitHub
- [ ] Initial commits pushed
- [ ] `.gitignore` working (no `.env` in repos)

---

## 🎯 NEXT STEPS (Sprint 2)

Once Sprint 1 is complete:

1. **Test registration flow:**
   - Create test user
   - Check email verification
   - Verify user in Supabase dashboard

2. **Test login flow:**
   - Login with test user
   - Check JWT token generated
   - Verify protected routes work

3. **Start Sprint 2:**
   - Complete authentication pages
   - Add form validation
   - Implement password reset
   - Build profile page

---

## 🆘 TROUBLESHOOTING

### **Frontend won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Backend won't start:**
```bash
# Check Node version (needs 20+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Database connection fails:**
- Verify Supabase credentials in `.env`
- Check Supabase project is not paused
- Verify RLS policies allow service role access

### **Email not sending:**
- Verify Gmail app password is correct
- Check 2-step verification is enabled
- Try sending test email with nodemailer

### **CORS errors:**
- Verify `FRONTEND_URL` in backend `.env`
- Check frontend is calling correct API URL
- Ensure both apps deployed and URLs match

---

## 📚 ADDITIONAL RESOURCES

### **Learning Resources:**
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Express:** https://expressjs.com
- **Supabase:** https://supabase.com/docs

### **Tools:**
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React Snippets

### **Community:**
- **LMSA Dev Team:** (create a Slack/WhatsApp group)
- **GitHub Issues:** Use for bug tracking
- **Weekly Standups:** Track progress

---

## 🎉 YOU'RE READY!

You now have:
✅ Complete project structure  
✅ Frontend and backend running locally  
✅ Staging environments deployed  
✅ Database schema implemented  
✅ All documentation organized  
✅ Git repositories set up  

**Sprint 1 Goal: Complete! 🚀**

**Next Sprint:** Build authentication system (login, register, password reset)

---

**Questions or stuck?** 
- Check the technical documentation in `/docs`
- Review error messages carefully
- Test one component at a time
- Commit often!

**Let's build something amazing for LMSA! 💚**