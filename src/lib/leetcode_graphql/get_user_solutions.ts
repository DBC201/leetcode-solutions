import graphql_post_request from "./graphql_api";

interface BodyVariables {
  first: number;
  orderBy: string;
  skip: number;
  username: string;
}

interface Body {
  operationName: string;
  query: string;
  variables: BodyVariables;
}

function createBody(first: number, username: string): Body {
    return {
        operationName: "ugcArticleUserSolutionArticles",
        query: `query ugcArticleUserSolutionArticles(
            $username: String!,
            $orderBy: ArticleOrderByEnum,
            $skip: Int,
            $before: String,
            $after: String,
            $first: Int,
            $last: Int
          ) {
            ugcArticleUserSolutionArticles(
              username: $username,
              orderBy: $orderBy,
              skip: $skip,
              before: $before,
              after: $after,
              first: $first,
              last: $last
            ) {
              totalNum
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  topicId
                  uuid
                  title
                  slug
                  createdAt
                  hitCount
                  questionSlug
                  questionTitle
                  reactions {
                    count
                    reactionType
                  }
                }
              }
            }
          }`,
        variables: {
          username,
          orderBy: "MOST_RECENT",
          skip: 0,
          first
        }
    };
}

interface UserSolutions {
    data: {
        ugcArticleUserSolutionArticles: {
            totalNum: number;
        },
        pageInfo: {
            hasNextPage: boolean;
        },
        edges: Array<{
            node: {
                topicId: string;
                uuid: string;
                title: string;
                slug: string;
                createdAt: string;
                hitCount: number;
                questionSlug: string;
                questionTitle: string;
                reactions: {
                    count: number;
                    reactionType: string;
                };
            };
        }>;
    }
};

export default async function get_user_solutions(username: string): Promise<UserSolutions | null> {
    const body = createBody(10000, username); // fetch all solutions at once

    const raw = await graphql_post_request(JSON.stringify(body));

    if (!raw) {
        return null;
    }

    try {
        const data: UserSolutions = JSON.parse(raw);
        return data;
    }
    catch (error) {
        console.log(`Error parsing user solutions data: ${error}`);
        console.log("Raw response:", raw);
        return null;
    }
}
