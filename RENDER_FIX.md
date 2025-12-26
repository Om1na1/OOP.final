# 🚨 Quick Fix: Update Render Settings Manually

## The Problem

Render is still using the old build command (`build.sh`) instead of the Dockerfile. This is because Render may have cached your initial configuration.

## The Solution

You need to manually update your Render service settings:

### Step 1: Go to Your Render Service

1. Open [render.com](https://render.com) and log in
2. Click on your service (e.g., `library-management-system`)

### Step 2: Update Build Settings

1. Click on **"Settings"** in the left sidebar
2. Scroll to **"Build & Deploy"** section
3. Update the following fields:

   **Docker:**
   - **Docker Command**: Leave blank (Render will use Dockerfile automatically)
   - **Dockerfile Path**: `./Dockerfile`
   
   OR if there's no Docker option, use:
   
   **Build Command**: Leave blank or delete the existing command
   - Render will automatically detect and use the Dockerfile

4. Click **"Save Changes"**

### Step 3: Trigger Manual Deploy

1. Go to the **"Manual Deploy"** section (top right)
2. Click **"Deploy latest commit"**
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy"**

### Step 4: Watch the Build

The build should now:
- ✅ Use the Dockerfile
- ✅ Build frontend with Node.js 18
- ✅ Build backend with Java 17
- ✅ Create optimized runtime image
- ✅ Deploy successfully

---

## Alternative: Delete and Recreate Service

If updating settings doesn't work:

### Option A: Use Render Blueprint (render.yaml)

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your repository
3. Render will automatically detect `render.yaml` and configure everything
4. Click **"Apply"**

### Option B: Manual Service Creation

1. Delete the existing service
2. Create new **Web Service**
3. Configure:
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Command**: (leave blank)
4. Add environment variables (see below)

---

## Environment Variables to Set

Make sure these are configured in your Render service:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | (from your PostgreSQL) | Internal Database URL |
| `DB_USERNAME` | `library_user` | From database |
| `DB_PASSWORD` | (from your PostgreSQL) | From database |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | Secure random string |
| `ALLOWED_ORIGINS` | `https://your-app.onrender.com` | Your actual Render URL |
| `SHOW_SQL` | `false` | Optional |

---

## Expected Build Output

When using Dockerfile, you should see:

```
==> Building with Dockerfile
Step 1/12 : FROM node:18-alpine AS frontend-build
Step 2/12 : WORKDIR /app/frontend
...
Step 7/12 : FROM maven:3.9-eclipse-temurin-17 AS backend-build
...
Step 12/12 : ENTRYPOINT ["java", "-jar", "app.jar"]
Successfully built [image-id]
==> Build successful!
```

---

## If You Still See build.sh Errors

The issue is that Render is not detecting the Dockerfile. Try:

1. **Check Dockerfile exists in root**: `ls -la Dockerfile`
2. **Verify it's pushed to GitHub**: Check your repository
3. **Force Render to use Docker**: In settings, explicitly set "Docker" as the environment

---

Need help? Let me know which step you're stuck on!
