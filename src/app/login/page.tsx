"use client"
import { useRouter } from "next/navigation"


function Login() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-5xl">Continue with Google</h1>
            <p>For now, login and signup can only be done via Google.</p>
            <button className="border border-white px-4 py-3 rounded-full backdrop-blur-lg">
                Login/Signup With Google
            </button>
        </div>
    );
}

export default Login
