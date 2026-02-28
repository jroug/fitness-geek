import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        const updateBodyCompositionUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/update-bodycomposition/`;
        const response = await fetch(updateBodyCompositionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        if (response.status === 400) {
            const payload = await response.json().catch(() => ({ message: 'Invalid request' }));
            return res.status(400).json(payload);
        }

        if (!response.ok) {
            return res.status(401).json({ message: 'Authentication failed (update-body-composition)' });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
