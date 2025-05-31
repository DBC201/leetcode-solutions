import { NextResponse } from "next/server";
import { get_user_solutions } from "@/lib/leetcode_graphql/get_user_solutions";

export async function POST(request: Request) {
    const raw = await request.text();

    let parsed = null;

    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        console.log(`Error parsing request body: ${error}`);
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { username } = parsed;

    const result = await get_user_solutions(username);

    if (!result) {
        return NextResponse.json({ error: "Failed to fetch user solutions" }, { status: 500 });
    }
    return NextResponse.json(result, { status: 200 });
}
