'use client'

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AddNewImage({ addImages }) {
    const supabase = createClientComponentClient();
    const [imagesToUpload, setImagesToUpload] = useState([]); // {id, file, previewUrl}

    // Handle file selection and upload immediately
    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        compressImage(file, async (compressedFile) => {
            const previewUrl = URL.createObjectURL(compressedFile);
            const newImages = [...imagesToUpload];
            newImages[index] = { id: `image${index + 1}`, file: compressedFile, previewUrl };
            setImagesToUpload(newImages);

            try {
                const fileExt = compressedFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;

                const { error } = await supabase.storage.from('vehicles').upload(fileName, compressedFile);
                if (error) throw error;

                // Send uploaded file name to parent
                addImages([fileName]);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image.');
            }
        });
    };

    // Compress image before upload
    const compressImage = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 1920;
                const maxHeight = 1080;
                let width = img.width;
                let height = img.height;

                if (width > height && width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                } else if (height > width && height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
                    callback(compressedFile);
                }, "image/jpeg", 0.9);
            };
        };
        reader.readAsDataURL(file);
    };

    // Add new empty file input
    const addEmptyInput = () => {
        setImagesToUpload(prev => [...prev, { id: `image${prev.length + 1}`, file: null, previewUrl: null }]);
    };

    // Remove a selected image (before or after upload)
    const removeImage = (id) => {
        setImagesToUpload(prev => prev.filter(img => img.id !== id));
    };

    return (
        <div>
            {imagesToUpload.map((img, index) => (
                <div key={img.id} className="flex flex-row items-center space-x-2 mb-2">
                    <input type="file" onChange={(e) => handleFileChange(index, e)} />
                    {img.file && <span>{(img.file.size / 1024).toFixed(1)} KB</span>}
                    {img.previewUrl && (
                        <img src={img.previewUrl} alt={img.id} width={150} height={100} className="h-[100px]" />
                    )}
                    <button onClick={() => removeImage(img.id)} className="text-red-500 font-bold">X</button>
                </div>
            ))}

            <button onClick={addEmptyInput} className="mt-2 px-3 py-1 bg-blue-600 rounded-md text-white">Add Image</button>
        </div>
    );
}