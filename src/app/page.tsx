"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
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
            setOutput("Error fetching user solutions.");
        }
    }

    return (
        <div className="container justify-content-center">
            <div className="row justify-content-center align-items-center mt-3">
                <div className="col-auto">
                    <label htmlFor="username" className="form-label">Enter LeetCode Username:</label>
                </div>
                <div className="col-auto">
                    <input type="text" ref={inputRef} className="form-control" defaultValue="dbc201" />
                </div>            
                <div className="col-auto">
                    <button onClick={onSubmit} className="btn btn-primary">Get User Solutions</button>
                </div> 
            </div>

            {output 
                && 
                <div className="row mt-3">
                    <pre>{output}</pre>
                </div>
            }
            
            <div className="row mt-3">
                {questions.map((question) => (
                    <div key={question.topicId} className="border border-2 border-dark rounded p-3 mb-3">
                        <a
                        href={`/solution?topicId=${question.topicId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                            <h3>{question.questionTitle} - {question.title}</h3>
                        </a>
                    </div>
                ))}
            </div>


        </div>
    );
}

