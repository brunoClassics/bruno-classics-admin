'use client'

import { useState } from "react"

export default function VideoLink({newVideos}) {

    const [numOfVideos, setNumOfVideos] = useState([])

    const handleInputChange = (index, event) => {
        const newNumOfVideos = [...numOfVideos];
        newNumOfVideos[index] = { id: `video${index + 1}`, file: event.target.value };
        setNumOfVideos(newNumOfVideos);
    }

    const handleRemoveVid = (id) => {
        setNumOfVideos(prevVids => prevVids.filter(item => item.id !== id));
    };



    return (
        <div className="flex flex-col space-y-3">
            <span className="font-light text-sm italic">Copy from address bar everything between 'v=' and '&'. If there is no '&', just everything after 'v='</span>
            {numOfVideos.map((item, index) => (
                <div key={item.id} className="flex flex-row">
                    <input name={item.id} onChange={(event) => handleInputChange(index, event)} className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />

                    <svg
                        onClick={() => handleRemoveVid(item.id)}
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
                    setNumOfVideos(prevVideos => [...prevVideos, { id: `video${prevVideos.length + 1}`, file: null }]);
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
            <input className="hidden" type="number" name="videoArrayLength" readOnly value={numOfVideos.filter(obj => obj.file).length} />
            {
                numOfVideos.map((video, index) => (
                    <input key={index} value={video.file} name={`video${index}`} className="hidden" readOnly />
                ))
            }
        </div>
    )
}