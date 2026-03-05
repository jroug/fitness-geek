import type { NextApiRequest, NextApiResponse } from 'next';

type DeleteGoalResponse = {
    message: string;
    deleted?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<DeleteGoalResponse>) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Only DELETE requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const { gid } = req.query;
        if (!gid || typeof gid !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing goal ID' });
        }

        const deleteGoalUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/delete-goal?gid=${encodeURIComponent(gid)}`;
        const response = await fetch(deleteGoalUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to delete goal' });
        }

        return res.status(200).json({
            message: data?.message || 'Goal deleted successfully',
            deleted: !!data?.deleted,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
