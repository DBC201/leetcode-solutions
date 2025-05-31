import 'bootstrap/dist/css/bootstrap.min.css';
import { get_solution } from '@/lib/leetcode_graphql/get_solution';
import { cache } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SearchParams {
    [key: string]: string | string[] | undefined;
}

const loadSolution = cache(async (topicId: string) => {
    return await get_solution(topicId);
});

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const topicId = (await searchParams).topicId;

    if (!topicId || Array.isArray(topicId)) {
        return "LeetCode Solution";
    }

    const response = await loadSolution(topicId);
    const title = response?.data?.ugcArticleSolutionArticle?.title ?? 'LeetCode Solution';

    return {
        title,
    };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams>; }) {
    const topicId = (await searchParams).topicId;

    if (!topicId || Array.isArray(topicId)) {
        return <h1>BOOOOOOOO THE MONSTER ROARS.</h1>;
    }

    const response = await loadSolution(topicId);

    if (!response) {
        return <h1>Solution not found.</h1>;
    }

    const content = response.data?.ugcArticleSolutionArticle?.content;
    const title = response.data?.ugcArticleSolutionArticle?.title;

    return (
        <div className="container justify-content-center">
            <div className="row mt-3 mb-3">
                <h1>{title}</h1>
            </div>

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
