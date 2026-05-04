import type { NextApiRequest, NextApiResponse } from 'next';

type NutritionLookupResponse =
    | {
        nutrition_found: true;
        nutrition: {
            calories: number;
            protein: number;
            carbohydrates: number;
            fat: number;
            fiber: number;
        };
        source: string;
    }
    | { message: string; nutrition_found?: false };

type OpenAIResponse = {
    output_text?: unknown;
    output?: Array<{
        content?: Array<{ type?: string; text?: string }>;
    }>;
};

type NutritionEstimate = {
    calories?: unknown;
    protein?: unknown;
    carbohydrates?: unknown;
    fat?: unknown;
    fiber?: unknown;
};

const extractOutputText = (data: unknown) => {
    const payload = data as OpenAIResponse;

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

const parseNutritionEstimate = (value: string): NutritionEstimate | null => {
    const cleanValue = value
        .trim()
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/, '')
        .trim();

    try {
        const parsed = JSON.parse(cleanValue) as NutritionEstimate;
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
};

const normalizeNumber = (value: unknown) => {
    const numberValue = typeof value === 'string' ? Number(value) : value;
    return typeof numberValue === 'number' && Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : 0;
};

const roundMacro = (value: number) => Math.round(value * 100) / 100;

export default async function handler(req: NextApiRequest, res: NextApiResponse<NutritionLookupResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const foodName = typeof req.body?.food_name === 'string' ? req.body.food_name.trim() : '';
    const servingSize = Number(req.body?.serving_size);

    if (!foodName || !Number.isFinite(servingSize) || servingSize <= 0) {
        return res.status(400).json({ message: 'Food name and serving size are required.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: 'Server is missing OPENAI_API_KEY.' });
    }

    try {
        const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_NUTRITION_MODEL || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
                input: [
                    {
                        role: 'system',
                        content:
                            'You estimate nutrition values for a food database. Return only valid JSON with these numeric gram/kcal fields: calories, protein, carbohydrates, fat, fiber. Use the requested serving size, not per-100g values. If the food is ambiguous, use a common plain version of the food. Do not include explanations.',
                    },
                    {
                        role: 'user',
                        content: `Food: ${foodName}\nServing size: ${servingSize} grams`,
                    },
                ],
            }),
        });

        if (!openAIResponse.ok) {
            const errorText = await openAIResponse.text();
            return res.status(openAIResponse.status).json({ message: errorText || 'OpenAI nutrition lookup failed.' });
        }

        const data = await openAIResponse.json();
        const outputText = extractOutputText(data);
        const estimate = parseNutritionEstimate(outputText);

        if (!estimate) {
            return res.status(502).json({ message: 'OpenAI returned nutrition data in an unexpected format.' });
        }

        return res.status(200).json({
            nutrition_found: true,
            nutrition: {
                calories: roundMacro(normalizeNumber(estimate.calories)),
                protein: roundMacro(normalizeNumber(estimate.protein)),
                carbohydrates: roundMacro(normalizeNumber(estimate.carbohydrates)),
                fat: roundMacro(normalizeNumber(estimate.fat)),
                fiber: roundMacro(normalizeNumber(estimate.fiber)),
            },
            source: 'OpenAI estimate',
        });
    } catch {
        return res.status(500).json({ message: 'Could not look up nutrition data.' });
    }
}
