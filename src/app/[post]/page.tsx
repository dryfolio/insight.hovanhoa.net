import Badge from '@/components/badge'
import ImagePreview from '@/components/image-preview'
import Navbar from '@/components/nav'
import TableOfContent from '@/components/toc'
import { BASE_URL, IMAGE, NAME } from '@/constants'
import formatDate from '@/lib/format-date'
import { type Tag, type Post } from '@/lib/types'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import NotFound from '@/app/not-found'
import {HashNode} from "@/lib/hashnode";


export default async function Page({ params }: { params: { post: string } }) {
    const postSlug = params.post
    const post:Post = await HashNode.getArticleBySlug(postSlug)

    if (!post) {
        return <NotFound />
    }

    return (
        <>
            <main className="min-h-screen relative pt-8">
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BlogPosting',
                            headline: post.title,
                            datePublished: post.publishedAt,
                            dateModified: post.publishedAt,
                            description: post.brief,
                            image: post?.coverImage?.url,
                            url: `${BASE_URL}/${postSlug}`,
                            author: {
                                '@type': 'Person',
                                name: NAME,
                            },
                        }),
                    }}
                />
                <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="items-center flex justify-between mb-6">
                        <Link href="/">
                            <Image
                                src={IMAGE}
                                alt={NAME}
                                className="h-12 w-12 rounded-full"
                                height={100}
                                width={100}
                            />
                        </Link>
                        <Navbar />
                    </div>
                    <h1 className="text-xl sm:text-3xl font-bold">
                        {post.title}
                    </h1>
                    <p className="my-2 text-sm leading-7 text-slate-500  ">
                        {formatDate(post.publishedAt)}{' '}
                        <span className="mx-2">•</span> {post.readTimeInMinutes}{' '}
                        min read
                    </p>
                    {post.tags.map((tag: Tag) => (
                        <Badge
                            label={tag.name}
                            key={tag.name}
                            className={
                                'absolute -top-6 right-0 md:static mb-2 mr-4'
                            }
                        />
                    ))}
                    <div className="relative my-2">
                        <ImagePreview
                            title={post.title}
                            imageURL={post?.coverImage?.url}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent  to-[#ffffff90] rounded-2xl" />
                    </div>
                    <article className="text-sm leading-7 text-slate-500 prose max-w-none my-4">
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: post.content.html,
                            }}
                        ></div>
                    </article>
                </section>
                <div className="top-60 left-20 h-full w-1/5 lg:block fixed lg hidden">
                    <TableOfContent
                        items={post.features.tableOfContents.items}
                    />
                </div>
                <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                    <Footer />
                </div>
            </main>
        </>
    )
}
