import 'bootstrap/dist/css/bootstrap.min.css';
import { get_solution } from '@/lib/leetcode_graphql/get_solution';
import { cache } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { get_question } from '@/lib/leetcode_scraper/get_question';

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
    const questionTitle = (await searchParams).questionTitle;

    if (!topicId || Array.isArray(topicId) || !questionTitle || Array.isArray(questionTitle)) {
        return { title: "LeetCode Solution" };
    }

    const response = await loadSolution(topicId);

    const title = response?.data?.ugcArticleSolutionArticle?.title;
    if (!title) {
        return {
            title: questionTitle
        };
    }

    return {
        title: `${questionTitle} - ${title}`,
    };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams>; }) {
    const topicId = (await searchParams).topicId;
    const questionSlug = (await searchParams).questionSlug;
    const questionTitle = (await searchParams).questionTitle;

    if (!topicId || Array.isArray(topicId) || !questionSlug || Array.isArray(questionSlug)) {
        return <h1>BOOOOOOOO THE MONSTER ROARS.</h1>;
    }

    const response = await loadSolution(topicId);

    if (!response) {
        return <h1>Solution not found.</h1>;
    }

    const solutionContent = response.data?.ugcArticleSolutionArticle?.content;
    const solutionTitle = response.data?.ugcArticleSolutionArticle?.title;

    // const question = await get_question(questionSlug);

    const unescaped = solutionContent.replace(/\\n/g, '\n');

    return (
        <div className="container justify-content-center">
            <div className="row mt-3 mb-3">
                <h1>Question: <a href={`https://leetcode.com/problems/${questionSlug}`} target="_blank"
                    rel="noopener noreferrer">{questionTitle}</a></h1>
            </div>

            {/* <div className="row mt-3 mb-3">
                {question.description}
            </div> */}

            <div className="row mt-3 mb-3">
                <h1>Solution: {solutionTitle}</h1>
            </div>

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {unescaped}
            </ReactMarkdown>
        </div>
    );
}
