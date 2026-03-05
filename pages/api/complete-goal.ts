import type { NextApiRequest, NextApiResponse } from 'next';

type CompleteGoalResponse = {
    message: string;
    completed?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<CompleteGoalResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const { gid } = req.body as { gid?: number | string };
        if (!gid) {
            return res.status(400).json({ message: 'Invalid or missing goal ID' });
        }

        const completeGoalUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/complete-goal/`;
        const response = await fetch(completeGoalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gid }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to complete goal' });
        }

        return res.status(200).json({
            message: data?.message || 'Goal completed successfully',
            completed: !!data?.completed,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
