import {graphql_post_request} from "./graphql_api";

export interface BodyVariables {
  topicId: string;
}

export interface Body {
  operationName: string;
  query: string;
  variables: BodyVariables;
}

export function createBody(topicId: string): Body {
  return {
    operationName: "ugcArticleSolutionArticle",
    query: `query ugcArticleSolutionArticle($articleId: ID, $topicId: ID) {
      ugcArticleSolutionArticle(articleId: $articleId, topicId: $topicId) {
        uuid
        title
        slug
        summary
        content
        articleType
        createdAt
        updatedAt
        status
        isLeetcode
        canSee
        canEdit
        isMyFavorite
        chargeType
        myReactionType
        hitCount
        hasVideoArticle
        isSerialized
        isAuthorArticleReviewer
        scoreInfo {
          scoreCoefficient
        }
        topicId
        topic {
          id
          topLevelCommentCount
        }
        tags {
          name
          slug
          tagType
        }
        reactions {
          count
          reactionType
        }
        author {
          realName
          userAvatar
          userSlug
          userName
          nameColor
          certificationLevel
          activeBadge {
            icon
            displayName
          }
        }
        thumbnail
        prev {
          uuid
          slug
          topicId
          title
        }
        next {
          uuid
          slug
          topicId
          title
        }
      }
    }`,
    variables: { 
        topicId
     }
  };
}


export interface Solution {
  data: {
    ugcArticleSolutionArticle: {
      uuid: string;
      title: string;
      slug: string;
      summary: string;
      author: {
        realName: string;
        userAvatar: string;
        userSlug: string;
        userName: string;
        nameColor: string | null;
        certificationLevel: string;
        activeBadge: {
          icon: string;
          displayName: string;
        } | null;
      };
      articleType: string;
      thumbnail: string;
      createdAt: string; // ISO date
      updatedAt: string; // ISO date
      status: string;
      isLeetcode: boolean;
      canSee: boolean;
      canEdit: boolean;
      isMyFavorite: boolean;
      chargeType: string;
      myReactionType: string | null;
      topicId: number;
      hitCount: number;
      hasVideoArticle: boolean;
      reactions: {
        count: number;
        reactionType: string;
      }[];
      tags: {
        name: string;
        slug: string;
        tagType: string | null;
      }[];
      topic: {
        id: number;
        topLevelCommentCount: number;
      };
      content: string;
      isSerialized: boolean;
      isAuthorArticleReviewer: boolean | null;
      scoreInfo: undefined;
      prev: {
        uuid: string;
        slug: string;
        topicId: string;
        title: string;
      } | null;
      next: {
        uuid: string;
        slug: string;
        topicId: string;
        title: string;
      } | null;
    };
  };
};

export async function get_solution(topicId: string): Promise<Solution | null> {
    const body = createBody(topicId);
    const raw = await graphql_post_request(JSON.stringify(body));

    if (!raw) {
        return null;
    }

    try {
        const data: Solution = JSON.parse(raw);
        return data;
    }
    catch (error) {
        console.log(`Error parsing user solutions data: ${error}`);
        console.log("Raw response:", raw);
        return null;
    }
}
