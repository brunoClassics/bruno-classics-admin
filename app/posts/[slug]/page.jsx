'use client'

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import AddNewImage from "./add-new-image"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import VideoLink from "@/app/add-vehicle/video-link"

export default function Page({ params }) {

    const supabase = createClientComponentClient()
    const decodedSlug = decodeURIComponent(params.slug)
    const [vehicle, setVehicle] = useState()
    const [title, setTitle] = useState('')
    const [year, setYear] = useState('')
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [specialEdition, setSpecialEdition] = useState('')
    const [mileType, setMileType] = useState('')
    const [miles, setMiles] = useState('')
    const [color, setColor] = useState('')
    const [driveTrain, setDriveTrain] = useState('')
    const [engine, setEngine] = useState('')
    const [imageUrlArray, setImageUrlArray] = useState([])
    const [imageArrayLength, setImageArrayLength] = useState(0)
    const [listingType, setListingType] = useState('')
    const [description, setDescription] = useState('')
    const [videoUrlArray, setVideoUrlArray] = useState([])
    const [videoArrayLength, setVideoArrayLength] = useState(0)
    const [price, setPrice] = useState('')
    const [featured, setFeatured] = useState('')
    const [homePage, setHomePage] = useState('')
    const [slug, setSlug] = useState('')
    const [removedImages, setRemovedImages] = useState([])
    const [addedImageUrlsArray, setAddedImageUrlsArray] = useState([])

    useEffect(() => {
        fetchVehicleData()
    }, [])

    useEffect(() => {
        console.log(removedImages)
    }, [removedImages])

    const fetchVehicleData = async () => {
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('slug', decodedSlug)
                .single()

            if (data) {
                setVehicle(data)
                setTitle(data.title)
                setMake(data.make)
                setModel(data.model)
                setYear(data.year)
                setSpecialEdition(data.special_edition)
                setMileType(data.mile_type)
                setMiles(data.miles)
                setColor(data.color)
                setDriveTrain(data.drive_train)
                setEngine(data.engine)
                setImageUrlArray(data.image_url_array)
                setImageArrayLength(data.image_array_length)
                setListingType(data.listing_type)
                setDescription(data.description)
                setVideoUrlArray(data.video_url_array)
                setVideoArrayLength(data.video_array_length)
                setPrice(data.price)
                setFeatured(data.featured)
                setHomePage(data.home_page)
            }
            if (error) {
                console.log(error)
            }

        } catch (error) {
            throw error
        }
    }

    const handleRemoveImage = (index) => {
        const updatedImages = [...imageUrlArray];
        const imagesToRemove = [...removedImages]
        imagesToRemove.push(imageUrlArray[index])
        setRemovedImages(imagesToRemove)
        updatedImages.splice(index, 1);
        setImageUrlArray(updatedImages);


    }


    return (
        <div className="w-full h-full m-5 border-2 border-blue-600 rounded-md p-5 text-white">
            {
                vehicle &&
                <div className="w-full h-full flex flex-row relative">
                    <div className="flex flex-col w-1/3 max-h-[80vh] overflow-y-scroll pr-3">
                        <label htmlFor="title">Title</label>
                        <input value={title} name="title" required className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="year">Year</label>
                        <input value={year} required name="year" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="make">Make</label>
                        <input value={make} required name="make" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="model">Model</label>
                        <input value={model} required name="model" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="specialEdition">Special Edition</label>
                        <input value={specialEdition} name="specialEdition" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="mileType">Mile Type</label>
                        <select value={mileType} required name="mileType" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" >
                            <option value={'Original'}>Original</option>
                            <option value={'Since Restoration'}>Since Restoration</option>
                        </select>
                        <label htmlFor="miles">Miles</label>
                        <input value={miles} required name="miles" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="color">Color</label>
                        <input value={color} required name="color" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="driveTrain">Drive Train</label>
                        <input value={driveTrain} required name="driveTrain" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="engine">Engine</label>
                        <input value={engine} required name="engine" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="listingType">Listing Type</label>
                        <select value={listingType} required name="listingType" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" >
                            <option value={'For Sale'}>For Sale</option>
                            <option value={'Coming Soon'}>Coming Soon</option>
                            <option value={'In The Shop'}>In The Shop</option>
                            <option value={'Sold'}>Sold</option>
                        </select>
                        <label htmlFor="description">Description</label>
                        <textarea value={description} required name="description" className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label htmlFor="price">Price</label>
                        <input value={price} name="price" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <div className="flex flex-row space-x-5">
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="featured">Featured</label>
                                <input name="featured" type="checkbox" checked={featured} value={'TRUE'} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="homePage">Home Page</label>
                                <input name="homePage" type="checkbox" checked={homePage} value={'TRUE'} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-2/3 h-full sticky top-0">
                        <div className="flex flex-col px-3 max-h-[38vh] overflow-y-scroll">
                            <div className="flex flex-row flex-wrap">
                                {
                                    imageUrlArray.map((image, index) => (
                                        <div key={index} className="relative">
                                            <svg
                                                onClick={() => handleRemoveImage(index)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="red"
                                                className="w-6 h-6 cursor-pointer absolute top-0 right-0 z-50"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <Image
                                                src={image}
                                                width={150}
                                                height={100}
                                                alt={`image${index}`}
                                                className="h-[100px]"
                                            />
                                        </div>
                                    ))
                                }

                            </div>
                            <AddNewImage />
                            <div className="py-1 px-3 bg-blue-600 rounded-md cursor-pointer mx-auto mt-3">Publish Picture Changes</div>
                        </div>
                        <div className="flex flex-row px-3 w-full max-h-[38vh] mt-7 border-t-2 border-blue-600 pt-3">
                            <div className="h-[38vh] w-full">
                                <div className="flex flex-row flex-wrap space-x-3">
                                {videoUrlArray.map((video, index) => (
                                    <div key={index} className="w-36 relative">
                                        <svg

                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="red"
                                            className="w-6 h-6 cursor-pointer absolute top-0 right-0 z-50"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <LiteYouTubeEmbed
                                            id={video}
                                            title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
                                        />
                                    </div>
                                ))}
                                </div>
                                <VideoLink />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}