import { HOST } from "@/constants";

export const GET_POST = `
query Publication {
  publication(host: "${HOST}") {
    isTeam
    title
    posts(first: 20) {
      edges {
        node {
          id
          title
          brief
          coverImage {
            url
          }
          tags {
            name
          }
          slug
          publishedAt
        }
      }
    }
  }
}
`;

export const GET_POST_BY_SLUG = `
query Publication($slug: String!) {
  publication(host: "${HOST}") {
    isTeam
    title
    post(slug: $slug) {
      title
      content {
        html
      }
      tags {
        name
      }
      publishedAt
      brief
      coverImage {
        url
      }
      readTimeInMinutes
      features {
        tableOfContents {
          items {
            id
            level
            slug
            title
            parentId
          }
        }
      }
    }
  }
}
`;
