import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const title = searchParams.get('title')

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundImage: 'url(https://hovanhoa.net/og-bg.jpg)',
                }}
            >
                <div
                    style={{
                        marginLeft: 150,
                        marginTop: 170,
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: 50,
                        fontFamily: 'Inter',
                        letterSpacing: '-0.05em',
                        color: '#2D3748',
                    }}
                >
                    {title}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
