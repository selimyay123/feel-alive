import Image from "next/image";
import Link from "next/link";

function Navbar() {
    return (
        <div className="w-full flex items-center justify-between py-4 px-12">
            <Link href="/" className=" italic text-xl">
                <Image src={"/feel-alive-logo.png"} alt={"app logo"} width={100} height={100} className="rounded-xl" />
            </Link>
            <div className="flex max-md:flex-col gap-4">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </div>
        </div>
    )
}

export default Navbar;
