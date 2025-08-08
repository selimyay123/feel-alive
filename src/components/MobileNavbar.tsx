"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Mail } from "lucide-react";

function MobileNavbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", icon: <Home size={30} />, label: "Home" },
        { href: "/about", icon: <Info size={30} />, label: "About" },
        { href: "/contact", icon: <Mail size={30} />, label: "Contact" },
    ];

    return (
        <div className="w-full flex-col items-center justify-center">
            <div className="flex gap-4 rounded-full text-black bg-white/15 backdrop-blur-lg py-3 px-5 w-fit ml-auto">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`p-3 max-md:p-2 rounded-full transition-all duration-200 ${isActive ? "bg-white text-black" : "text-white"
                                }`}
                        >
                            <span className="block">{link.icon}</span>
                        </Link>
                    );
                })}
            </div>

            <Link href="/" className="">
                <Image
                    src={"/new-logo-1.png"}
                    alt={"app logo"}
                    width={250}
                    height={250}
                    className="rounded-xl mx-auto"
                />
            </Link>
        </div>
    );
}

export default MobileNavbar;
