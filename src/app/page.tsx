"use client";
import { useRef, useState } from "react";
import { Question } from "@/lib/leetcode_graphql/get_user_solutions";

export default function Page() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [output, setOutput] = useState("");

    const [questions, setQuestions] = useState<Question[]>([]);

    async function onSubmit() {
        setOutput(""); // Clear previous output
        if (!inputRef.current) {
            setOutput("Input reference is not available.");
            return;
        }

        const username = inputRef.current.value;

        if (!username) {
            setOutput("Please enter a username.");
            return;
        }

        try {
            const response = await fetch("/api/get_user_solutions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            const data = await response.text();
            
            let parsedData = null;

            try {
                parsedData = JSON.parse(data);
            } catch (e) {
                setOutput("Error parsing response data.");
                return;
            }

            const edges = parsedData?.data?.ugcArticleUserSolutionArticles?.edges;

            if (Array.isArray(edges)) {
                setQuestions(edges.map((edge: { node: Question }) => edge.node));
            } else {
                setOutput("No solutions found for the given user.");
            }
        } catch (err) {
            console.error("Error fetching user solutions:", err);
        }
    }

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={onSubmit}>Get User Solutions</button>
            {output && <pre>{output}</pre>}

            <div>
                {
                    questions.map((question) => {
                        return (
                            <div key={question.uuid}>
                                <h3>{question.title}</h3>
                                <p>Topic ID: {question.topicId}</p>
                                <p>Created At: {new Date(question.createdAt).toLocaleDateString()}</p>
                                <p>Hit Count: {question.hitCount}</p>
                                <p>Question Slug: {question.questionSlug}</p>
                                <p>Question Title: {question.questionTitle}</p>
                                <p>Reactions: {question.reactions.count} ({question.reactions.reactionType})</p>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

