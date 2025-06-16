import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { postContent } = await req.json();

  const prompt = `
You are a professional active on LinkedIn. Write a short, thoughtful reply to the following post.

Post:
"${postContent}"

Tone: Insightful

Reply in 1–2 sentences. Be natural and conversational. Add value.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content.trim();

  return Response.json({ reply });
}
