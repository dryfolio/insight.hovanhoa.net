'use client'

import { useEffect, useRef, useState } from 'react'

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                }
                hideTimeoutRef.current = setTimeout(() => {
                    setIsVisible(false)
                }, 1000)
            } else {
                setIsVisible(false)
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                    hideTimeoutRef.current = null
                }
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    )
}