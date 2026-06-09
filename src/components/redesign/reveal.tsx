'use client'

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react'

// Reveal — fade-up on scroll with a timeout fallback.
export function Reveal({
    children,
    delay = 0,
    className = '',
    style,
}: {
    children: ReactNode
    delay?: number
    className?: string
    style?: CSSProperties
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [on, setOn] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) {
            setOn(true)
            return
        }
        let done = false
        const show = () => {
            if (!done) {
                done = true
                setOn(true)
            }
        }
        const t = setTimeout(show, 700 + delay)
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(
                ([e]) => {
                    if (e.isIntersecting) {
                        show()
                        io.disconnect()
                    }
                },
                { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
            )
            io.observe(el)
            return () => {
                clearTimeout(t)
                io.disconnect()
            }
        }
        show()
        return () => clearTimeout(t)
    }, [delay])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                opacity: on ? 1 : 0,
                transform: on ? 'none' : 'translateY(14px)',
                transition: `opacity .6s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .6s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

export default Reveal
