import Image from "next/image"
import Link from "next/link"

export default function PostCard({ vehicle }) {

    return (
        <div className="w-64 h-96 border-2 border-blue-600 rounded-md flex flex-col text-white justify-between mt-5 mx-5">
            {
                (vehicle.image_url_array && vehicle.image_url_array[0]) &&

                <Image
                    src={vehicle.image_url_array[0]}
                    width={256}
                    height={158}
                    alt={vehicle.title}
                    className="rounded-t-sm"
                />
            }
            {
                (!vehicle.image_url_array || vehicle.image_url_array[0] === undefined) &&

                <div className="w-64 h-40 flex-row items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-64 h-40">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>

                </div>
            }
            
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">title:</span>
                <span>{vehicle.title}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">year:</span>
                <span>{vehicle.year}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">make:</span>
                <span>{vehicle.make}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">model:</span>
                <span>{vehicle.model}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">color:</span>
                <span>{vehicle.color}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">miles:</span>
                <span>{vehicle.miles}</span>
            </div>
            <div className="flex flex-row space-x-5 pl-3">
                <span className="font-bold capitalize">listing type:</span>
                <span>{vehicle.listing_type}</span>
            </div>
            <div className="bg-blue-600 rounded-b-sm py-1 px-3 w-full text-center">
                <Link href={`/posts/${vehicle.slug}`}>
                    <p>EDIT</p>
                </Link>
            </div>
        </div>
    )
}