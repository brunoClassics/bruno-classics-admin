import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const title = formData.get('title')
    const year = formData.get('year')
    const make = formData.get('make')
    const model = formData.get('model')
    const specialEdition = formData.get('specialEdition')
    const mileType = formData.get('mileType')
    const miles = formData.get('miles')
    const color = formData.get('color')
    const driveTrain = formData.get('driveTrain')
    const engine = formData.get('engine')
    const imageArrayLength = formData.get('imageArrayLength')
    let urlArray = []
    for( let i = 0; i < imageArrayLength; i++) {
        urlArray.push(formData.get(`url${i}`))
    }
    const listingType = formData.get('listingType')
    const description = formData.get('description')
    const videoArrayLength = formData.get('videoArrayLength')
    let vidArray = []
    for(let i = 0; i < videoArrayLength; i++) {
        vidArray.push(formData.get(`video${i}`))
    }
    const price = formData.get('price')
    const featured = formData.get('featured')
    const homePage = formData.get('homePage')
    let slug = `${make}-${model}-${year}-${new Date().toISOString()}`;
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })


    try {

        const { data, error } = await supabase
            .from('vehicles')
            .insert([
                {
                    title: title,
                    year: year,
                    make: make,
                    model: model,
                    special_edition: specialEdition,
                    mile_type: mileType,
                    miles: miles,
                    color: color,
                    drive_train: driveTrain,
                    engine: engine,
                    image_array_length: imageArrayLength,
                    image_url_array: urlArray,
                    listing_type: listingType,
                    description: description,
                    video_array_length: videoArrayLength,
                    video_url_array: vidArray,
                    price: price,
                    featured: featured,
                    home_page: homePage,
                    slug: slug,
                },
            ])
            .select()

            console.log('anything')
        if(data) {
            console.log(data)
        }
        if (error) throw error
        
    } catch (error) {
        alert('Error updating the data! ', error)
        console.log('error')
        console.log(error)
    } finally {
        console.log('something')
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`, {
            status: 301,
        })
    }





}