import Link from 'next/link'
import React from 'react'
import { BASE_URL } from '@/constants'

export function Footer() {
    return (
        <footer>
            <nav className="relative mx-auto max-w-xl mt-40">
                <ul className="flex items-center space-x-6 text-slate-900">
                    <p className="hover:text-slate-900 transition duration-300 ease-in-out">
                        © 2025{' '}
                        <Link
                            href={BASE_URL}
                            target="_self"
                            className="text-sky-600"
                        >
                            hovanhoa.net
                        </Link>{' '}
                        | Software Engineer
                    </p>
                </ul>
            </nav>
        </footer>
    )
}
