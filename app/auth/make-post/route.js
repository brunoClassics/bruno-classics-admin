import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
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
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })


    try {

        const { data, error } = await supabase
            .from('vehicles')
            .insert([
                {
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
                },
            ])
            .select()
        if (error) throw error
        console.log()
    } catch (error) {
        console.log(error)
        console.log('Error updating the data!')
    } finally {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`, {
            status: 301,
        })
    }





}