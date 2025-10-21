# Vercel Environment Variables Setup

## ✅ Auto-configured by Supabase Integration
Great news! The following variables are already set by the Vercel/Supabase integration:
- `SUPABASE_URL` ✅
- `SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `SUPABASE_JWT_SECRET` ✅
- `POSTGRES_URL` ✅
- `POSTGRES_PRISMA_URL` ✅ (Used by Prisma for connection pooling)
- `POSTGRES_URL_NON_POOLING` ✅ (Direct connection)
- `POSTGRES_HOST` ✅
- `POSTGRES_USER` ✅
- `POSTGRES_PASSWORD` ✅
- `POSTGRES_DATABASE` ✅

**The database is already configured!** The app will automatically use `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` from Vercel.

## 📝 Variables You Need to Add Manually

Go to your Vercel Dashboard → Project Settings → Environment Variables and add ONLY these:

### 1. Domain Configuration (Required)
```
NEXT_PUBLIC_DOMAIN
```
**Value:** Your Vercel deployment URL
```
https://your-project-name.vercel.app
```

### 2. Stripe Configuration (Required for payments)
```
STRIPE_SECRET_KEY
```
**Value:** Your Stripe secret key (starts with `sk_live_` or `sk_test_`)
**Where to find:** Stripe Dashboard → Developers → API Keys

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
**Value:** Your Stripe publishable key (starts with `pk_live_` or `pk_test_`)
**Where to find:** Stripe Dashboard → Developers → API Keys

---

## 🎉 Summary

You only need to add **3 variables manually**:
1. ✅ `NEXT_PUBLIC_DOMAIN` - Your Vercel URL
2. ✅ `STRIPE_SECRET_KEY` - Your Stripe secret key
3. ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

**Everything else is already configured by the Vercel/Supabase integration!**

---

## 🔧 How to Add Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

## 🚀 After Adding Variables

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Select "Use existing Build Cache" (optional)
5. Click **Redeploy**

## ✅ Code Changes Made

All Supabase client files now support **both naming conventions**:
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`

This means the app will work with:
- ✅ Vercel's auto-generated variables (from Supabase integration)
- ✅ Manual NEXT_PUBLIC_ prefixed variables
- ✅ Local development environment

## 📋 Quick Checklist

- [ ] NEXT_PUBLIC_DOMAIN added (your Vercel URL)
- [ ] STRIPE_SECRET_KEY added
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY added
- [ ] Redeployed the project
- [ ] Run database migrations: `npx prisma db push` (in Vercel, this happens automatically)
- [ ] Seed the database if needed
- [ ] Verified build succeeds
- [ ] Tested the deployed site

## 🔍 How to Get Supabase Database URL

### Method 1: From Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Project Settings** (⚙️ icon)
4. Click **Database**
5. Scroll to **Connection string**
6. Select **URI** format
7. Copy the connection string
8. Replace `[YOUR-PASSWORD]` with your actual database password

### Method 2: From Vercel Logs
If you see the error during build, check the Vercel build logs - sometimes it shows the Postgres connection details.

## 🆘 Troubleshooting

**Build fails with "apiKey not provided":**
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set (should be auto-set)
- Redeploy after adding variables

**Database connection fails:**
- Verify `DATABASE_URL` format is correct
- Make sure password doesn't have special characters that need URL encoding
- Use the connection pooler URL (port 6543) not direct connection (port 5432)

**Stripe checkout doesn't work:**
- Verify `STRIPE_SECRET_KEY` is set correctly
- Make sure you're using the right key (test vs live)
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` matches the secret key environment

## 📞 Need Help?

If you're stuck:
1. Check Vercel deployment logs for specific error messages
2. Verify all environment variables are set in Vercel dashboard
3. Make sure you redeployed after adding variables
4. Check Supabase Dashboard → Project Settings → Database for connection strings
