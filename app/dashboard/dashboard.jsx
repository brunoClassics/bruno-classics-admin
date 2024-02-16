'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import PostCard from './post-card'

export default function Dashboard() {

    const [vehicles, setVehicles] = useState(null)
    const [sorting, setSorting] = useState('')
    const supabase = createClientComponentClient()

    useEffect(() => {
        fetchVehicles()
    }, [sorting])
    useEffect(() => {
        console.log(vehicles)
    }, [vehicles])

    const fetchVehicles = async () => {
        try {
            const { data, error } = await (
                sorting === 'For Sale' || sorting === 'Sold' || sorting === 'Coming Soon' || sorting === 'In The Shop' ?
                    supabase
                        .from('vehicles')
                        .select('*')
                        .eq('listing_type', sorting)
                        .order('created_at', { ascending: false }) :
                sorting === 'Home Page' ?
                    supabase
                        .from('vehicles')
                        .select('*')
                        .eq('home_page', 'TRUE')
                        .order('created_at', { ascending: false }) :
                sorting === 'Featured' ?
                    supabase
                        .from('vehicles')
                        .select('*')
                        .eq('featured', 'TRUE')
                        .order('created_at', { ascending: false }) :
                supabase
                    .from('vehicles')
                    .select('*')
                    .order('created_at', { ascending: false })
            );
            

            if (data) {
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
        <div className='flex flex-col relative w-full'>
            <div className='flex flex-row text-white justify-center space-x-3 sticky top-0 w-full py-3 bg-transparent backdrop-blur-sm border-b-2 border-blue-600 shadow-md shadow-blue-900'>
                <button className={`${sorting === '' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('') }}>All</button>
                <button className={`${sorting === 'For Sale' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('For Sale') }}>For Sale</button>
                <button className={`${sorting === 'In The Shop' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('In The Shop') }}>In The Shop</button>
                <button className={`${sorting === 'Coming Soon' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('Coming Soon') }}>Coming Soon</button>
                <button className={`${sorting === 'Sold' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('Sold') }}>Sold</button>
                <button className={`${sorting === 'Featured' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('Featured') }}>Featured</button>
                <button className={`${sorting === 'Home Page' ? 'rounded-md bg-blue-600 w-32 p-3 ring-2 ring-white' : 'rounded-md bg-blue-600 w-32 p-3'}`} onClick={() => { setSorting('Home Page') }}>Home Page</button>
            </div>
            <div className='flex flex-wrap'>
                {
                    vehicles &&
                    vehicles.map((vehicle, index) => (
                        <PostCard key={index} vehicle={vehicle} />
                    ))
                }
            </div>
        </div>
    )
}