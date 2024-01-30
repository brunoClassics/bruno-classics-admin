import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AddVehicleForm from './add-vehicle-form'


export default async function AddVehicle() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  return (
    <AddVehicleForm />
  )
  }