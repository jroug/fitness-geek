import type { NextApiRequest, NextApiResponse } from 'next';

type AddGoalResponse =
    | { message: string; goal_added: true; goal: unknown }
    | { message: string; goal_added?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<AddGoalResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const addGoalUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-goal/`;
        const response = await fetch(addGoalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to add goal' });
        }

        return res.status(200).json({
            message: data.message || 'Goal added successfully',
            goal_added: !!data.goal_added,
            goal: data.goal,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
