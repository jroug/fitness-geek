import type { NextApiRequest, NextApiResponse } from 'next';

type DeleteWorkoutResponse =
    | { message: string; deleted: true }
    | { message: string; deleted?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<DeleteWorkoutResponse>) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Only DELETE requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const wid = req.query.wid;
        if (!wid || Array.isArray(wid)) {
            return res.status(400).json({ message: 'Invalid workout id' });
        }

        const deleteUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/delete-workout-item?wid=${encodeURIComponent(wid)}`;
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to delete workout' });
        }

        return res.status(200).json({
            message: data?.message || 'Workout deleted successfully',
            deleted: !!data?.deleted,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
