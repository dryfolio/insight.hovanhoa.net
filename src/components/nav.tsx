import { INSIGHT_URL, BASE_URL, GALLERY_URL } from '@/constants'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    return (
        <header>
            <nav className="relative mx-auto max-w-xl">
                <ul className="flex items-center space-x-6 text-base text-black cursor-pointer">
                    <Link
                        className="hover:underline hover:decoration-wavy hover:underline-offset-8 transition duration-300 ease-in-out"
                        href={BASE_URL}
                    >
                        Home
                    </Link>
                    <Link
                        className="hover:underline hover:decoration-wavy hover:underline-offset-8 transition duration-300 ease-in-out"
                        href={INSIGHT_URL}
                    >
                        Insight
                    </Link>
                    <Link
                        className="hover:underline hover:decoration-wavy hover:underline-offset-8 transition duration-300 ease-in-out"
                        href={GALLERY_URL}
                    >
                        Gallery
                    </Link>
                </ul>
            </nav>
        </header>
    )
}
