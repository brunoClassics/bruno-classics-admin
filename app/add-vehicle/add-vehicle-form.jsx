import UploadImage from "./upload-image";
import VideoLink from "./video-link";

export default function AddVehicleForm() {


    return (
        <form action="/auth/make-post" method="post" className="flex flex-col space-y-3 w-2/3 h-full border-2 border-blue-800 p-5 rounded-md mb-5">
            <label htmlFor="title">Title</label>
            <input name="title" required className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="year">Year</label>
            <input required name="year" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="make">Make</label>
            <input required name="make" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="model">Model</label>
            <input required name="model" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="specialEdition">Special Edition</label>
            <input name="specialEdition" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="mileType">Mile Type</label>
            <select required name="mileType" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" >
                <option value={'Original'}>Original</option>
                <option value={'Since Restoration'}>Since Restoration</option>
            </select>
            <label htmlFor="miles">Miles</label>
            <input required name="miles" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="color">Color</label>
            <input required name="color" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="driveTrain">Drive Train</label>
            <input required name="driveTrain" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label htmlFor="engine">Engine</label>
            <input required name="engine" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label>Images</label>
            <UploadImage />
            <label htmlFor="listingType">Listing Type</label>
            <select required name="listingType" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" >
                <option value={'For Sale'}>For Sale</option>
                <option value={'Coming Soon'}>Coming Soon</option>
                <option value={'In The Shop'}>In The Shop</option>
                <option value={'Sold'}>Sold</option>
            </select>
            <label htmlFor="description">Description</label>
            <textarea required name="description" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <label>Videos</label>
            <VideoLink />
            <label htmlFor="price">Price</label>
            <input name="price" className="bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
            <div className="flex flex-row space-x-5">
                <div className="flex flex-col space-y-3">
                    <label htmlFor="featured">Featured</label>
                    <input name="featured" type="checkbox" value={'TRUE'} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                </div>
                <div className="flex flex-col space-y-3">
                    <label htmlFor="homePage">Home Page</label>
                    <input name="homePage" type="checkbox" value={'TRUE'} className="cursor-pointer bg-slate-900 py-1 border-2 border-blue-900 rounded-md" />
                </div>
            </div>
            <button className="p-2 bg-blue-800 font-semibold rounded-md">Submit</button>
        </form>
    )
}