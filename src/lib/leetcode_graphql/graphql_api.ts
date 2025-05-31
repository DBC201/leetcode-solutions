export type Headers = {
    "Content-Type": string;
    "x-csrftoken"?: string;
} & Record<string, string>;

export function graphql_post_request(
    body: string,
    headers: Headers = { "Content-Type": "application/json" }
): Promise<string> {
    return new Promise((resolve) => {
        fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: headers,
            body,
        })
        .then((response) => {
            if (!response.ok) {
                console.log(`LeetCode GraphQL request failed with status: ${response.status}`);
                response.text().then((text) => console.log("Response body:", text));
                resolve("");
            } else {
                response.text().then((text) => resolve(text));
            }
        })
        .catch((error) => {
            console.log(`Error making LeetCode GraphQL request: ${error}`);
            resolve("");
        });
    });
}
