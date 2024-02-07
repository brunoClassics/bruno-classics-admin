import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Dashboard from './dashboard'


export default async function Page() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  return (
    <div>
        <Dashboard />
    </div>
  )
  }