import { gql } from "@apollo/client";

export const GET_STATISTIC = gql`
  query viewer($zoneTag: string, $date_start: string, $date_end: string) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      httpRequests1dGroups(
        orderBy: [date_ASC]
        limit: 1000
        filter: { date_geq: $date_start, date_lt: $date_end }
      ) {
        date: dimensions {
          date
        }
        sum {
          requests
          pageViews
          cachedBytes
          bytes
        }
        uniq {
          uniques
        }
      }
    }
  }
}
`;

export const GET_ARTICLES = gql`
  query Publication($host: String, $pageSize: Int!, $page: Int!) {
    publication(host: $host) {
      id
      isTeam
      title
      postsViaPage(pageSize: $pageSize, page: $page) {
        nodes {
          id
          title
          subtitle
          views
          brief
          tags {
            name
          }
          url
          views
          slug
          publishedAt
          updatedAt
          author {
            name
            location
          }
          coverImage {
            url
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          nextPage
          previousPage
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_POST = gql`
  query Publication($host: String, $slug: String!) {
    publication(host: $host) {
      id
      isTeam
      title
      post(slug: $slug) {
        id
        title
        subtitle
        publishedAt
        brief
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
        author {
          id
          name
          username
          profilePicture
        }
        tags {
          id
          name
          slug
        }
        coverImage {
          url
        }
        content {
          markdown
          html
          text
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_POINTER = gql`
  query Publication($host: String, $first: Int!) {
    publication(host: $host) {
      id
      isTeam
      title
      posts(first: $first) {
        edges {
          node {
            id
            title
            subtitle
            views
            tags {
              id
              name
            }
            brief
            url
            slug
            publishedAt
            updatedAt
            author {
              name
              location
            }
            coverImage {
              url
            }
          }
        }
      }
    }
  }
`;
