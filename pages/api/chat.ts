import type { NextApiRequest, NextApiResponse } from 'next';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const extractOutputText = (data: unknown): string => {
  const payload = data as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof payload.output_text === 'string' && payload.output_text.trim().length > 0) {
    return payload.output_text.trim();
  }

  if (!Array.isArray(payload.output)) return '';

  return payload.output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .filter((part) => part?.type === 'output_text' && typeof part.text === 'string')
    .map((part) => String(part.text))
    .join('\n')
    .trim();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing OPENAI_API_KEY' });
  }

  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const safeMessages = messages
    .filter(
      (msg): msg is ChatMessage =>
        !!msg &&
        (msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string',
    )
    .map((msg) => ({ role: msg.role, content: msg.content.trim() }))
    .filter((msg) => msg.content.length > 0);

  if (safeMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages to send' });
  }

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: safeMessages,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      return res.status(openAIResponse.status).json({ error: errorText || 'OpenAI request failed' });
    }

    const data = await openAIResponse.json();
    const answer = extractOutputText(data);

    return res.status(200).json({
      answer: answer || 'I could not generate a response.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
}
