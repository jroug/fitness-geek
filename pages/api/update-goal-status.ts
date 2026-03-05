import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateGoalStatusResponse = {
    message: string;
    updated?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateGoalStatusResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const { gid, status } = req.body as { gid?: number | string; status?: string };
        if (!gid || !status || !['active', 'completed', 'canceled', 'paused'].includes(status)) {
            return res.status(400).json({ message: 'Invalid or missing goal data' });
        }

        const updateGoalStatusUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/update-goal-status/`;
        const response = await fetch(updateGoalStatusUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gid, status }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to update goal status' });
        }

        return res.status(200).json({
            message: data?.message || 'Goal status updated successfully',
            updated: !!data?.updated,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
