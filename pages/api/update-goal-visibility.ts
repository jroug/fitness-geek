import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateGoalVisibilityResponse = {
    message: string;
    updated?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateGoalVisibilityResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const { gid, show_in_calendar, show_in_dashboard } = req.body as {
            gid?: number | string;
            show_in_calendar?: boolean;
            show_in_dashboard?: boolean;
        };

        if (!gid || typeof show_in_calendar !== 'boolean' || typeof show_in_dashboard !== 'boolean') {
            return res.status(400).json({ message: 'Invalid or missing goal visibility data' });
        }

        const updateGoalVisibilityUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/update-goal-visibility/`;
        const response = await fetch(updateGoalVisibilityUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gid, show_in_calendar, show_in_dashboard }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to update goal visibility' });
        }

        return res.status(200).json({
            message: data?.message || 'Goal visibility updated successfully',
            updated: !!data?.updated,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
