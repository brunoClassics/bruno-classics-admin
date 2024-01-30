import Link from "next/link"

export default function Navigation() {

    return (
        <ul className="fixed top-0 left-0 w-1/6 h-screen flex flex-col items-center space-y-5 pt-10 border-r-2 border-r-blue-800">
            <li className="p-2 w-32 text-center rounded-md text-white bg-blue-800">
                <Link href={'/dashboard'}>
                    <p>Dash Board</p>
                </Link>
            </li>
            <li className="p-2 w-32 text-center rounded-md text-white bg-blue-800">
                <Link href={'/add-vehicle'}>
                    <p>Add Vehicle</p>
                </Link>
            </li>
            <li className="p-2 w-32 text-center rounded-md text-white bg-blue-800">
                <Link href={'/account'}>
                    <p>Account</p>
                </Link>
            </li>
            <li className="p-2 w-32 text-center rounded-md text-white bg-blue-800">
                <form action="/auth/signout" method="post">
                    <button className="w-full h-full text-center" type="submit">
                        Sign Out
                    </button>
                </form>
            </li>
        </ul>
    )
}