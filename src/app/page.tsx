"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useState } from "react";
import { QuestionMetadata } from "@/lib/leetcode_graphql/get_user_solutions";

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [output, setOutput] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit() {
    setOutput("");
    if (!inputRef.current) {
      setOutput("Input reference is not available.");
      return;
    }

    const username = inputRef.current.value;
    if (!username) {
      setOutput("Please enter a username.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/get_user_solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const dataText = await response.text();
      let parsedData = null;
      try {
        parsedData = JSON.parse(dataText);
      } catch {
        setOutput("Error parsing response data.");
        return;
      }

      const edges = parsedData?.data?.ugcArticleUserSolutionArticles?.edges;
      if (Array.isArray(edges)) {
        setQuestions(edges.map((edge: { node: QuestionMetadata }) => edge.node));
      } else {
        setOutput("No solutions found for the given user.");
      }
    } catch {
      setOutput("Error fetching user solutions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container justify-content-center">
      <div className="row justify-content-center align-items-center mt-3">
        <div className="col-auto">
          <label htmlFor="username" className="form-label">
            Enter LeetCode Username:
          </label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            defaultValue="dbc201"
            disabled={loading}
          />
        </div>
        <div className="col-auto">
          <button onClick={onSubmit} className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </span>
            ) : (
              "Get User Solutions"
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="row justify-content-center mt-3">
          <div className="col-auto">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {output && (
        <div className="row mt-3">
          <pre>{output}</pre>
        </div>
      )}

      <div className="row mt-3">
        {questions.map((question) => (
          <div key={question.topicId} className="border border-2 border-dark rounded p-3 mb-3">
            <a
              href={`/solution?topicId=${question.topicId}&questionSlug=${question.questionSlug}&questionTitle=${encodeURIComponent(
                question.questionTitle
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>
                {question.questionTitle} - {question.title}
              </h3>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
