import type { NextApiRequest, NextApiResponse } from 'next';

type AddWorkoutResponse =
    | { message: string; workout_added: true; workout: unknown }
    | { message: string; workout_added?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<AddWorkoutResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const addWorkoutUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-workout-item/`;
        const response = await fetch(addWorkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to add workout' });
        }

        return res.status(200).json({
            message: data?.message || 'Workout added successfully',
            workout_added: !!data?.workout_added,
            workout: data?.workout,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
