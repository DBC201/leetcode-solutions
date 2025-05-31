import * as cheerio from 'cheerio';

export function get_question_html(questionSlug: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = `https://leetcode.com/problems/${questionSlug}`;

        fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WhatsApp/2.19; +http://www.whatsapp.com/)',
                'Accept': 'text/html',
            }
        })
            .then(response => {
                if (!response.ok) {
                    console.log(`LeetCode problem request failed with status: ${response.status}`);
                    response.text().then((text) => console.log("Response body:", text));
                    resolve("");
                } else {
                    response.text().then((text) => resolve(text));
                }
            })
            .catch(error => reject(error));
    });
}

export interface Question {
    title: string | null;
    description: string | null;
};

export async function get_question(questionSlug: string): Promise<Question> {
  const html = await get_question_html(questionSlug);
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content') ?? null;
  const description = $('meta[name="description"]').attr('content') ?? null;

  return { title, description };
}
