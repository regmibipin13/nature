# Nature & Nurtures - Admin Panel Access

## 🔐 Admin Credentials

**Login URL:** http://localhost:3001/login  
(or http://localhost:3000/login if port 3000 is available)

**Email:** admin@naturenurtures.com  
**Password:** Admin@123456

---

## 📝 Important Notes

### Email Confirmation
Supabase requires email confirmation by default. You have two options:

#### Option 1: Disable Email Confirmation (Recommended for Local Development)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `sjftrwszobbxcsufnalm`
3. Go to **Authentication** → **Providers** → **Email**
4. Scroll down and **DISABLE** "Confirm email"
5. Save changes
6. Now you can login immediately with the credentials above

#### Option 2: Confirm Email via Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user `admin@naturenurtures.com`
4. Click on the user and manually confirm the email
5. Then you can login

---

## 🎯 Dashboard Features

After logging in, you'll have access to:

- **Dashboard Overview** - Sales statistics and analytics
- **Products Management** - Add, edit, delete products
- **Categories Management** - Manage product categories
- **Collections Management** - Product collections
- **Orders Management** - View and manage customer orders
- **Blogs Management** - Create and manage blog posts
- **Page Content Editor** - Edit Hero, Info, FAQ, Footer sections

---

## 🔄 Creating Additional Admin Users

To create more admin users, run:

```bash
npm run create-admin
```

Then edit the script at `scripts/create-admin.ts` to change the email and password.

---

## 🛠️ Troubleshooting

### Can't Login?
1. Make sure email confirmation is disabled in Supabase (see above)
2. Check that your Supabase credentials are correct in `.env` file
3. Verify the user exists in Supabase Dashboard → Authentication → Users

### Forgot Password?
Use the Supabase Dashboard to reset the password or delete the user and create a new one with:
```bash
npm run create-admin
```

---

## 🔒 Security Recommendations

### For Production:
1. **Change the default admin password immediately**
2. Enable email confirmation
3. Use strong, unique passwords
4. Enable 2FA if available
5. Use environment-specific credentials
6. Never commit `.env` files to version control

---

## 📱 Quick Access

- **Frontend:** http://localhost:3001
- **Admin Login:** http://localhost:3001/login
- **Dashboard:** http://localhost:3001/dashboard
- **Supabase Project:** https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm

---

**Last Updated:** October 21, 2025
