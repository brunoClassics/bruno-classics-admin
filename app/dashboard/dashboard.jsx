'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import PostCard from './post-card'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [sorting, setSorting] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchVehicles()
  }, [sorting])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      // Fetch vehicles with current sorting
      let query = supabase.from('vehicles').select('*').order('created_at', { ascending: false })

      if (['For Sale', 'Sold', 'Coming Soon', 'In The Shop'].includes(sorting)) {
        query = query.eq('listing_type', sorting)
      } else if (sorting === 'Home Page') {
        query = query.eq('home_page', 'TRUE')
      } else if (sorting === 'Featured') {
        query = query.eq('featured', 'TRUE')
      }

      const { data: vehicleData, error } = await query
      if (error) throw error

      // Generate signed URLs for the first image of each vehicle
      const vehiclesWithSignedUrls = await Promise.all(
        vehicleData.map(async (vehicle) => {
          let first_image_url = null

          if (vehicle.image_url_array && vehicle.image_url_array.length > 0) {
            const firstFile = vehicle.image_url_array[0]
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('vehicles')
              .createSignedUrl(firstFile, 60) // 60 seconds validity

            if (signedUrlError) {
              console.error('Error creating signed URL:', signedUrlError.message)
            } else {
              first_image_url = signedUrlData.signedUrl
            }
          }

          return { ...vehicle, first_image_url }
        })
      )

      setVehicles(vehiclesWithSignedUrls)
    } catch (error) {
      console.error('Error fetching vehicles:', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col relative w-full'>
      {/* Sorting Buttons */}
      <div className='flex flex-row text-white justify-center space-x-3 sticky top-0 w-full py-3 bg-transparent backdrop-blur-sm border-b-2 border-blue-600 shadow-md shadow-blue-900'>
        {['', 'For Sale', 'In The Shop', 'Coming Soon', 'Sold', 'Featured', 'Home Page'].map((sort) => (
          <button
            key={sort}
            className={`rounded-md bg-blue-600 w-32 p-3 ${sorting === sort ? 'ring-2 ring-white' : ''}`}
            onClick={() => setSorting(sort)}
          >
            {sort === '' ? 'All' : sort}
          </button>
        ))}
      </div>

      {/* Vehicle Cards */}
      {loading ? (
        <div className='flex justify-center w-full mt-10'>
          <p className='text-white text-lg'>Loading vehicles...</p>
        </div>
      ) : (
        <div className='flex flex-wrap'>
          {vehicles.map((vehicle, index) => (
            <PostCard key={index} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}