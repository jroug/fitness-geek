import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateWorkoutResponse =
    | { message: string; updated: true; workout: unknown }
    | { message: string; updated?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateWorkoutResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
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

        const updateUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/update-workout-item?wid=${encodeURIComponent(wid)}`;
        const response = await fetch(updateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to update workout' });
        }

        return res.status(200).json({
            message: data?.message || 'Workout updated successfully',
            updated: !!data?.updated,
            workout: data?.workout,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
