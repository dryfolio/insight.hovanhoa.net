import type { ReactNode } from 'react'

// Eyebrow — uppercase mono section label.
export function Eyebrow({
    children,
    num,
}: {
    children: ReactNode
    num?: string
}) {
    return (
        <div className="rd-eyebrow">
            {num && <span className="rd-num">{num}</span>}
            {children}
        </div>
    )
}

export default Eyebrow
