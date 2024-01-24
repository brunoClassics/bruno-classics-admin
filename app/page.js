import Login from "./login-form"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center">
      <div className="flex flex-col items-center w-96 h-fit bg-slate-900 p-5 rounded-md border-2 border-blue-800 shadow-lg shadow-blue-800">
        <Image 
          width={250}
          height={100}
          src={'/logo_fullSize.png'}
        />
        <Login />
      </div>
    </div>
  )
}