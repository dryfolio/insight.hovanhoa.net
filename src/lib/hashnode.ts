import client from "./apollo-client";
import {GET_ARTICLE_BY_POINTER, GET_ARTICLE_BY_POST, GET_ARTICLES} from "./queries";


export const HashNode = {
    getArticles: async ({
                            pageSize,
                            page,
                        }: {
        pageSize?: number;
        page?: number;
    }): Promise<any> => {
        try {
            return await client.query({
                query: GET_ARTICLES,
                variables: {
                    host: process.env.NEXT_PUBLIC_HASHNODE_HOST!,
                    pageSize: pageSize || 20,
                    page: page || 1,
                },
                fetchPolicy: "no-cache",
            });
        } catch (error) {
            console.error("[ERROR 1]", error);
            return error;
        }
    },

    getArticlesByPointer: async ({ first }: { first: number }): Promise<any> => {
        try {
            return await client.query({
                query: GET_ARTICLE_BY_POINTER,
                variables: {
                    host: process.env.NEXT_PUBLIC_HASHNODE_HOST!,
                    first: first || 10,
                },
                fetchPolicy: "no-cache",
            });
        } catch (error) {
            console.error("[ERROR 2]", error);
            return error;
        }
    },

    getArticleBySlug: async (slug: string): Promise<any> => {
        try {
            const res = await client.query({
                query: GET_ARTICLE_BY_POST,
                variables: {
                    host: process.env.NEXT_PUBLIC_HASHNODE_HOST!,
                    slug,
                },
                fetchPolicy: "no-cache",
            });

            return res?.data?.publication?.post
        } catch (error) {
            console.error("[ERROR 3]", error);
            return error;
        }
    },
};
