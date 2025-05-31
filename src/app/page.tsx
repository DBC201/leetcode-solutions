"use client";
import { useRef, useState } from "react";

export default function Page() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [output, setOutput] = useState("");

    async function onSubmit() {
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
            setOutput(data);
        } catch (err) {
            setOutput("Error fetching solutions.");
        }
    }

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={onSubmit}>Get User Solutions</button>
            <pre>{output}</pre>
        </div>
    );
}

