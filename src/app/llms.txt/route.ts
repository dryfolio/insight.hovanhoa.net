import { NextResponse } from 'next/server'
import {
    NAME,
    FULL_NAME,
    BASE_URL,
    TWITTER,
    LINKEDIN,
    GITHUB,
    ROLE,
    INSIGHT_URL,
    GALLERY_URL,
    STATUS_URL,
    INFO_URL,
} from '@/constants'

export async function GET() {
    const llmsContent = `# About ${FULL_NAME}

## Basic Information
- Name: ${FULL_NAME}
- Username: ${NAME}
- Role: ${ROLE}
- Website: ${BASE_URL}

## Professional Profile
Hey there! 👋 I'm Hòa.

Software Engineer with 2+ years of experience. I am confident in my knowledge of software development concepts, industry best practices, and modern software technologies.

## Tech Stack
- Golang (https://go.dev/)
- Python (https://www.python.org/)
- PostgreSQL (https://www.postgresql.org/)
- MongoDB (https://www.mongodb.com/)
- AWS (https://aws.amazon.com/)
- GCP (https://cloud.google.com/)

## Social Links
- Twitter: https://twitter.com/${TWITTER}
- GitHub: https://github.com/${GITHUB}
- LinkedIn: https://linkedin.com/in/${LINKEDIN}

## Additional Resources
- Insight: ${INSIGHT_URL}
- Gallery: ${GALLERY_URL}
- Status: ${STATUS_URL}
- Info: ${INFO_URL}

## Contact
Check out ${INFO_URL} to connect with me!
Monitor my services at ${STATUS_URL}.
`

    return new NextResponse(llmsContent, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
}
