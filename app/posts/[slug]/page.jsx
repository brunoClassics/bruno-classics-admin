'use client'

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AddNewImage from "./add-new-image"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import AddNewVideo from "./add-new-video"
import DeleteVehicleButton from "./delete-vehicle"

export default function Page({ params }) {
    const supabase = createClientComponentClient()
    const decodedSlug = decodeURIComponent(params.slug)

    // Vehicle info
    const [vehicle, setVehicle] = useState()
    const [vehicleID, setVehicleID] = useState()
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
    
    const [imageUrlArray, setImageUrlArray] = useState([]) // file names only
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]) // signed URLs for display
    const [addedImageUrlsArray, setAddedImageUrlsArray] = useState([]) // newly added files
    const [removedImages, setRemovedImages] = useState([])

    const [listingType, setListingType] = useState('')
    const [description, setDescription] = useState('')
    const [videoUrlArray, setVideoUrlArray] = useState([])
    const [videosToAdd, setVideosToAdd] = useState([])
    const [price, setPrice] = useState('')
    const [featured, setFeatured] = useState('')
    const [homePage, setHomePage] = useState('')
    const [removedVideos, setRemovedVideos] = useState([])

    useEffect(() => {
        fetchVehicleData()
    }, [])

    const fetchVehicleData = async () => {
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('slug', decodedSlug)
                .single()

            if (error) throw error
            if (data) {
                setVehicle(data)
                setVehicleID(data.id)
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
                setListingType(data.listing_type)
                setDescription(data.description)
                setVideoUrlArray(data.video_url_array)
                setPrice(data.price)
                setFeatured(data.featured)
                setHomePage(data.home_page)

                const fileNames = data.image_url_array || []
                setImageUrlArray(fileNames)

                // Generate signed URLs for preview
                const previews = await Promise.all(
                    fileNames.map(async (fileName) => {
                        const { data: signedUrlData, error: signedUrlError } = await supabase
                            .storage
                            .from('vehicles')
                            .createSignedUrl(fileName, 300) // valid 5 minutes
                        if (signedUrlError) {
                            console.error('Error creating signed URL:', signedUrlError.message)
                            return null
                        }
                        return signedUrlData.signedUrl
                    })
                )
                setImagePreviewUrls(previews)
            }
        } catch (error) {
            console.error('Error fetching vehicle:', error)
        }
    }

    // Remove image from array and bucket
    const handleRemoveImage = async (index) => {
        const fileName = imageUrlArray[index]
        const updatedFileNames = [...imageUrlArray]
        const updatedPreviews = [...imagePreviewUrls]

        updatedFileNames.splice(index, 1)
        updatedPreviews.splice(index, 1)

        setImageUrlArray(updatedFileNames)
        setImagePreviewUrls(updatedPreviews)
        setRemovedImages((prev) => [...prev, fileName])

        // Remove from Supabase bucket
        const { error } = await supabase.storage.from('vehicles').remove([fileName])
        if (error) console.error('Error removing image from bucket:', error.message)
        else console.log('Removed image:', fileName)
    }

    // Add new images
    const handleAddImage = async (fileNames) => {
        if (!fileNames || fileNames.length === 0) return;

        try {
            // Generate signed URLs for preview
            const signedUrls = await Promise.all(
                fileNames.map(async (fileName) => {
                    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                        .from('vehicles')
                        .createSignedUrl(fileName, 300) // 5 minutes for admin preview
                    if (signedUrlError) {
                        console.error('Error generating signed URL:', signedUrlError.message);
                        return null;
                    }
                    return signedUrlData.signedUrl;
                })
            );

            const validSignedUrls = signedUrls.filter(Boolean);

            // Update state: previews for display, file names for storage
            setImagePreviewUrls((prev) => [...prev, ...validSignedUrls]);
            setImageUrlArray((prev) => [...prev, ...fileNames]);
            setAddedImageUrlsArray((prev) => [...prev, ...fileNames]);
        } catch (error) {
            console.error('Error adding new images:', error);
        }
    };

    const handleAddVideo = (file) => setVideoUrlArray((prev) => [...prev, file])
    const handleRemoveVideo = (index) => {
        const removed = videoUrlArray[index]
        setRemovedVideos((prev) => [...prev, removed])
        setVideoUrlArray((prev) => prev.filter((_, i) => i !== index))
    }

    const publishEdits = async () => {
        try {
            const { error } = await supabase
                .from('vehicles')
                .upsert({
                    id: vehicleID,
                    title: title,
                    make: make,
                    model: model,
                    year: year,
                    special_edition: specialEdition,
                    mile_type: mileType,
                    miles: miles,
                    color: color,
                    drive_train: driveTrain,
                    engine: engine,
                    image_url_array: imageUrlArray, // only file names
                    listing_type: listingType,
                    description: description,
                    video_url_array: videoUrlArray,
                    price: price,
                    featured: featured,
                    home_page: homePage
                })
            if (error) console.error('Error publishing edits:', error.message)
            else console.log('Edits published!')
        } catch (error) {
            console.error('Error publishing edits:', error)
        }
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        if (name === 'featured') setFeatured(checked ? 'TRUE' : '')
        if (name === 'homePage') setHomePage(checked ? 'TRUE' : '')
    }

    return (
        <div className="w-full h-full m-5 border-2 border-blue-600 rounded-md p-5 text-white">
            {vehicle && (
                <div className="w-full h-full flex flex-row relative border-b-2 border-b-blue-600">
                    {/* Left column: form fields */}
                    <div className="flex flex-col w-1/3 max-h-[75vh] overflow-y-scroll pr-4 pb-3 pl-1">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Year</label>
                        <input value={year} onChange={(e) => setYear(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Make</label>
                        <input value={make} onChange={(e) => setMake(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Model</label>
                        <input value={model} onChange={(e) => setModel(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Special Edition</label>
                        <input value={specialEdition} onChange={(e) => setSpecialEdition(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Mile Type</label>
                        <select value={mileType} onChange={(e) => setMileType(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md">
                            <option value={'Original'}>Original</option>
                            <option value={'Since Restoration'}>Since Restoration</option>
                        </select>
                        <label>Miles</label>
                        <input value={miles} onChange={(e) => setMiles(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Color</label>
                        <input value={color} onChange={(e) => setColor(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Drive Train</label>
                        <input value={driveTrain} onChange={(e) => setDriveTrain(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Engine</label>
                        <input value={engine} onChange={(e) => setEngine(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Listing Type</label>
                        <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md">
                            <option value={'For Sale'}>For Sale</option>
                            <option value={'Coming Soon'}>Coming Soon</option>
                            <option value={'In The Shop'}>In The Shop</option>
                            <option value={'Sold'}>Sold</option>
                        </select>
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="pl-1 bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <label>Price</label>
                        <input value={price} onChange={(e) => setPrice(e.target.value)} className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                        <div className="flex flex-row space-x-5">
                            <div className="flex flex-col space-y-3">
                                <label>Featured</label>
                                <input type="checkbox" name="featured" checked={featured === 'TRUE'} onChange={handleCheckboxChange} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                            </div>
                            <div className="flex flex-col space-y-3">
                                <label>Home Page</label>
                                <input type="checkbox" name="homePage" checked={homePage === 'TRUE'} onChange={handleCheckboxChange} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Right column: images and videos */}
                    <div className="flex flex-col w-2/3 h-full sticky top-0">
                        <div className="flex flex-col px-3 max-h-[38vh] overflow-y-scroll">
                            <div className="flex flex-row flex-wrap">
                                {imagePreviewUrls.map((signedUrl, index) => (
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
                                        <img
                                            src={signedUrl}
                                            width={150}
                                            height={100}
                                            alt={`image${index}`}
                                            className="h-[100px]"
                                        />
                                    </div>
                                ))}
                            </div>
                            <AddNewImage addImages={handleAddImage} />
                        </div>

                        {/* Videos */}
                        <div className="flex flex-row px-3 w-full max-h-[38vh] mt-7 border-t-2 border-blue-600 pt-3">
                            <div className="h-[38vh] w-full overflow-y-scroll">
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
                                                onClick={() => handleRemoveVideo(index)}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <LiteYouTubeEmbed id={video} title={`Video ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <AddNewVideo newVideos={handleAddVideo} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-row">
                <div onClick={publishEdits} className="w-fit p-3 rounded-md bg-blue-600 text-white mt-1 mx-auto cursor-pointer">Publish Changes</div>
                <DeleteVehicleButton vehicleID={vehicleID} />
            </div>
        </div>
    )
}