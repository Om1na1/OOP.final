# 🚀 Deploy to Render - Step by Step Guide

Your project is now ready to deploy to Render! Follow these steps:

## ✅ What's Been Configured

All necessary files have been created and configured:
- ✅ `build.sh` - Builds frontend and backend
- ✅ `start.sh` - Starts the application
- ✅ `render.yaml` - Render configuration blueprint
- ✅ Updated `application.properties` for environment variables
- ✅ Updated `CorsConfig.java` for production origins

## 📋 Deployment Steps

### Step 1: Push Your Code to GitHub

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your **GitHub account** (recommended for easy integration)

### Step 3: Create a PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `library-db`
   - **Database**: `library_db`
   - **User**: `library_user`
   - **Region**: Choose closest to you
   - **Instance Type**: **Free** (or paid if you prefer)
3. Click **"Create Database"**
4. Wait for it to provision (takes ~2 minutes)
5. **Keep this page open** - you'll need the connection details

### Step 4: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"** and authorize Render to access your GitHub
3. Find and select your repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `library-management-system` (or your preferred name)
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: **Java**
   
   **Build & Deploy:**
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `java -jar target/demo-0.0.1-SNAPSHOT.jar`
   
   **Instance Type:**
   - Select **Free** (or paid tier for better performance)

5. Click **"Advanced"** to add environment variables

### Step 5: Configure Environment Variables

Add these environment variables (click **"Add Environment Variable"** for each):

#### Required Variables:

1. **DATABASE_URL**
   - Go to your PostgreSQL database page
   - Copy the **"Internal Database URL"** 
   - Paste it here
   - Example: `postgresql://library_user:password@dpg-xxx.oregon-postgres.render.com/library_db`

2. **DB_USERNAME**
   - Value: `library_user` (or the username from your database)

3. **DB_PASSWORD**
   - Go to your database page
   - Copy the password
   - Paste it here

4. **JWT_SECRET**
   - Generate a secure secret: Open terminal and run:
     ```bash
     openssl rand -base64 32
     ```
   - Copy the output and paste as the value

5. **ALLOWED_ORIGINS**
   - Value: `https://your-app-name.onrender.com`
   - Replace `your-app-name` with the name you chose in Step 4
   - You can add multiple origins separated by commas if needed

#### Optional Variables:

6. **SHOW_SQL** (optional)
   - Value: `false` (set to `true` for debugging)

7. **JWT_EXPIRATION** (optional)
   - Value: `86400000` (24 hours in milliseconds)

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render will start building your application
3. Watch the logs in real-time
4. First deployment takes ~5-10 minutes (building frontend + backend)

### Step 7: Verify Deployment

Once deployment is complete:

1. Click on the URL at the top of your service page (e.g., `https://library-management-system.onrender.com`)
2. You should see your React application!
3. Test the signup/login functionality

### Step 8: Update ALLOWED_ORIGINS (Important!)

After your first deployment:

1. Note your actual Render URL (e.g., `https://library-management-system-abc123.onrender.com`)
2. Go to your web service → **Environment** tab
3. Update the `ALLOWED_ORIGINS` variable with your actual URL
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## 🔧 Troubleshooting

### Build Fails

**Issue**: `npm install` fails
- **Solution**: Check that `frontend/package.json` exists and is valid

**Issue**: Maven build fails
- **Solution**: Check logs for specific errors, ensure Java 17 is being used

### Database Connection Issues

**Issue**: Can't connect to database
- **Solution**: 
  - Verify `DATABASE_URL` is the **Internal Database URL** (not External)
  - Check username and password match your database credentials
  - Ensure database is in the same region as your web service

### Application Starts but Shows Errors

**Issue**: CORS errors in browser console
- **Solution**: Update `ALLOWED_ORIGINS` to match your actual Render URL

**Issue**: JWT errors
- **Solution**: Ensure `JWT_SECRET` is set and is at least 32 characters

### Free Tier Limitations

- **Cold starts**: Free tier services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds to wake up
- **Solution**: Upgrade to paid tier for always-on service

---

## 🎯 Post-Deployment

### Enable Auto-Deploy

Render automatically deploys when you push to your main branch. To disable:
1. Go to **Settings** → **Build & Deploy**
2. Toggle **"Auto-Deploy"**

### Monitor Your Application

- **Logs**: Click on "Logs" tab to see real-time application logs
- **Metrics**: View CPU, memory usage, and request metrics
- **Events**: See deployment history and events

### Custom Domain (Optional)

1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records as instructed
4. Update `ALLOWED_ORIGINS` to include your custom domain

---

## 📝 Important Notes

1. **Database Backups**: Free tier doesn't include automatic backups. Consider upgrading for production.

2. **Environment Variables**: Never commit sensitive values (passwords, secrets) to Git.

3. **Health Checks**: Render automatically checks if your app is running. If you want custom health checks, add a `/api/health` endpoint.

4. **Logs**: Check logs regularly for errors or issues.

5. **Scaling**: You can scale your service in the Settings if you need more resources.

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Check Logs**: Most issues can be diagnosed from the deployment logs

---

## ✨ Your Application URLs

After deployment, you'll have:

- **Web App**: `https://your-service-name.onrender.com`
- **API**: `https://your-service-name.onrender.com/api/*`
- **Database**: Internal URL (not publicly accessible)

---

**Good luck with your deployment! 🚀**
