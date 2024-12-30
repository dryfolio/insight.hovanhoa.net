import Link from 'next/link'
import React from 'react'
import { BASE_URL } from '@/constants'

export default function NotFound() {
    return (
        <div className="grid h-screen place-content-center bg-background px-4 text-center gap-5">
            <div>
                <h1 className="text-7xl font-black text-slate-900">404</h1>
            </div>
            <Link href={BASE_URL} className="text-sky-600">
                <button>Go Back Home</button>
            </Link>
        </div>
    )
}
