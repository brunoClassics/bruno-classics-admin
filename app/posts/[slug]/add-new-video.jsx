'use client'

import { useState, useEffect } from "react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

export default function AddNewVideo({ newVideos }) {

    const [numOfVideos, setNumOfVideos] = useState([])

    useEffect(() => {
        console.log(numOfVideos)
    }, [numOfVideos])

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
            <span className="font-light text-sm italic">You will see the cover photo for the video if ID is valid</span>
            {numOfVideos.map((item, index) => (
                <div key={item.id} className="flex flex-row space-x-3 items-center">

                    <input name={item.id} value={numOfVideos[index].file} onChange={(event) => handleInputChange(index, event)} className="h-fit bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                    <div className="p-1 w-fit h-fit cursor-pointer bg-blue-600 rounded-md" onClick={() => newVideos(item.file)}>Link Video</div>
                    {
                        item.file &&
                        <div className="w-24">
                        <LiteYouTubeEmbed
                            id={item.file}
                            title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
                            playerClass="hidden"
                        />
                        </div>
                    }
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