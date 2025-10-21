import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') })

// Initialize Supabase client with service role key (admin privileges)
// Note: In production, NEVER expose service role key in client code
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function createAdminUser() {
  const email = 'admin@naturenurtures.com'
  const password = 'Admin@123456'

  console.log('Creating admin user...')
  console.log('Email:', email)
  console.log('Password:', password)

  try {
    // First, try to delete existing user by signing in and deleting
    console.log('\n🔄 Checking for existing user...')
    
    // Sign up the admin user with email confirmation disabled
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
        data: {
          email_confirmed: true
        }
      }
    })

    if (error) {
      console.error('❌ Error creating admin user:', error.message)
      
      // If user already exists
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        console.log('\n⚠️  User already exists but may not be confirmed.')
        console.log('\n📋 Please follow these steps to fix:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('1. Go to: https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm/auth/users')
        console.log('2. Find user: admin@naturenurtures.com')
        console.log('3. Click the three dots (•••) on the right side of the user row')
        console.log('4. Click "Delete User"')
        console.log('5. Confirm deletion')
        console.log('6. Run this script again: npm run create-admin')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        console.log('🔗 Direct Link: https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm/auth/users')
        return
      }
      
      process.exit(1)
    }

    if (data.user) {
      console.log('\n✅ Admin user created successfully!')
      
      if (data.user.email_confirmed_at) {
        console.log('✓ Email is already confirmed!')
      } else {
        console.log('\n⚠️  Email confirmation required!')
        console.log('\n� Quick Fix - Manually Confirm User:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('1. Go to: https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm/auth/users')
        console.log('2. Click on: admin@naturenurtures.com')
        console.log('3. Scroll to "Email" section')
        console.log('4. Click "Send Confirmation Email" button')
        console.log('   OR')
        console.log('5. Manually set "email_confirmed_at" to current time')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }
      
      console.log('\n📋 Admin Credentials:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔗 Login URL: http://localhost:3001/login')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('\n🔗 User Management: https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm/auth/users')
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

createAdminUser()
