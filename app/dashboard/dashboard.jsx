'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import PostCard from './post-card'

export default function Dashboard() {

    const [vehicles, setVehicles] = useState(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        fetchVehicles()
    }, [])
    useEffect(() => {
        console.log(vehicles)
    }, [vehicles])

    const fetchVehicles = async () => {
        try {
           const {data, error} = await supabase
                .from('vehicles')
                .select('*')
                .order('created_at', {ascending: false})

            if(data) {
                setVehicles(data)
                
            }
            if (error) {
                throw error
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error.message);
        }
    }


    return (
        <div className='flex flex-wrap'>
            {
                vehicles &&
                vehicles.map((vehicle, index) => (
                    <PostCard key={index} vehicle={vehicle} />
                ))
            }
        </div>
    )
}