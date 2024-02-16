'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AddNewImage({addImages}) {
    const supabase = createClientComponentClient();
    const [numberOfImages, setNumberOfImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [urlArray, setUrlArray] = useState([])

    useEffect(() => {
        if (currentIndex !== null) {
            const file = numberOfImages[currentIndex]?.file;
            if (file) {
                uploadImageToSupabase(file);
            }
        }
    }, [currentIndex]);

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            compressImage(file, (compressedImage) => {
                const newImages = [...numberOfImages];
                newImages[index] = { id: `image${index + 1}`, file: compressedImage };
                setCurrentIndex(index);
                setNumberOfImages(newImages);
            });
        }
    };

    const uploadImageToSupabase = async (file) => {
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('vehicles').upload(filePath, file);
            console.log(filePath)

            const newUrl = [...urlArray, `https://hffzexjxyqrqketevocr.supabase.co/storage/v1/object/public/vehicles/${filePath}`]
            setUrlArray(newUrl)

            if (uploadError) {
                throw uploadError;
            }
        } catch (error) {
            alert('Error uploading vehicle image!');
        } finally {
            console.log('success')
        }
    };

    const handleRemoveImage = (id) => {
        setNumberOfImages(prevImages => prevImages.filter(item => item.id !== id));
    };

    const compressImage = (file, callback) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new window.Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 1920; // Set your desired maximum width
                const maxHeight = 1080; // Set your desired maximum height

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
                    callback(compressedFile);
                }, "image/jpeg", 0.9); // Adjust the quality as needed
            };
        };

        reader.readAsDataURL(file);
    };

    const formatFileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(size) / Math.log(k)));
        return Math.round(size / Math.pow(k, i), 2) + ' ' + sizes[i];
    };

    return (
        <div>
            {numberOfImages.map((item, index) => (
                <div key={item.id} className="flex flex-row">
                    <input type="file" name={item.id} onChange={(event) => handleFileChange(index, event)} />
                    <span>{item.file ? formatFileSize(item.file.size) : ''}</span>
                    {
                        item.file &&
                        <Image
                            src={URL.createObjectURL(item.file)}
                            alt={item.id}
                            width={150}
                            height={100}
                            className="h-[100px]"
                        />
                    }
                    <svg
                        onClick={() => handleRemoveImage(item.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
            ))}
            <svg
                onClick={() => {
                    setNumberOfImages(prevImages => [...prevImages, { id: `image${prevImages.length + 1}`, file: null }]);
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <input className="hidden" type="number" name="imageArrayLength" readOnly value={numberOfImages.filter(obj => obj.file).length} />
            {
                urlArray.map((url, index) => (
                    <input key={index} value={url} name={`url${index}`} className="hidden" readOnly />
                ))
            }
            <div onClick={() => {addImages(urlArray)}} className="py-1 px-3 bg-blue-600 rounded-md cursor-pointer mx-auto mt-3 w-fit">Publish Added Pictures</div>
        </div>
    );
}
