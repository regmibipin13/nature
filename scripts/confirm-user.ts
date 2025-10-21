import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function confirmUser() {
  const email = 'admin@naturenurtures.com'
  
  console.log('Attempting to confirm user:', email)
  console.log('\n⚠️  Note: This script can only work with the service role key.')
  console.log('Since we only have the anon key, please follow these steps:\n')
  
  console.log('📋 Manual Confirmation Steps:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('1. Go to: https://supabase.com/dashboard/project/sjftrwszobbxcsufnalm')
  console.log('2. Click on "Authentication" in the left sidebar')
  console.log('3. Click on "Users" tab')
  console.log('4. Find the user: admin@naturenurtures.com')
  console.log('5. Click on the user row')
  console.log('6. Look for "Email Confirmed" field')
  console.log('7. If it shows "false" or unconfirmed, click the confirmation button')
  console.log('   OR edit the user and manually set email_confirmed_at to current timestamp')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  // Try to get user info
  console.log('Checking user status...\n')
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.log('❌ Cannot check user status (not logged in)')
  }
  
  console.log('\n💡 Alternative Solution:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Go to Supabase Dashboard:')
  console.log('Authentication → Providers → Email → Uncheck "Confirm email"')
  console.log('Then DELETE the existing user and create a new one with:')
  console.log('npm run create-admin')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

confirmUser()
