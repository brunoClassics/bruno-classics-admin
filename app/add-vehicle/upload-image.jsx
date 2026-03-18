'use client'

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UploadImage() {
    const supabase = createClientComponentClient();
    const [imagesToUpload, setImagesToUpload] = useState([]); // {id, file, previewUrl}
    const [fileNamesArray, setFileNamesArray] = useState([]); // stores only file names

    // Handle file selection and compress + upload immediately
    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            compressImage(file, async (compressedFile) => {
                const newImages = [...imagesToUpload];
                const previewUrl = URL.createObjectURL(compressedFile);

                newImages[index] = { id: `image${index + 1}`, file: compressedFile, previewUrl };
                setImagesToUpload(newImages);

                // Upload to Supabase immediately
                try {
                    const fileExt = compressedFile.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const { error } = await supabase.storage.from('vehicles').upload(fileName, compressedFile);

                    if (error) throw error;

                    setFileNamesArray(prev => [...prev, fileName]); // store only file name
                } catch (err) {
                    console.error('Error uploading image:', err);
                    alert('Failed to upload image.');
                }
            });
        }
    };

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
                }, "image/jpeg", 0.9);
            };
        };
        reader.readAsDataURL(file);
    };

    const addEmptyInput = () => {
        setImagesToUpload(prev => [...prev, { id: `image${prev.length + 1}`, file: null, previewUrl: null }]);
    };

    const removeImage = (id) => {
        setImagesToUpload(prev => prev.filter(img => img.id !== id));
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
            {imagesToUpload.map((img, index) => (
                <div key={img.id} className="flex flex-row items-center space-x-2">
                    <input type="file" onChange={(e) => handleFileChange(index, e)} />
                    {img.file && <span>{formatFileSize(img.file.size)}</span>}
                    {img.previewUrl && (
                        <img src={img.previewUrl} alt={img.id} width={150} height={100} className="h-[100px]" />
                    )}
                    <button type="button" onClick={() => removeImage(img.id)} className="text-red-500 font-bold">X</button>
                </div>
            ))}

            <button type="button" onClick={addEmptyInput} className="mt-2 px-3 py-1 bg-blue-600 rounded-md text-white">Add Image</button>

            {/* Hidden inputs for form submission */}
            <input type="hidden" name="imageArrayLength" value={imagesToUpload.filter(img => img.file).length} />
            {fileNamesArray.map((fileName, index) => (
                <input key={index} type="hidden" name={`url${index}`} value={fileName} />
            ))}
        </div>
    );
}