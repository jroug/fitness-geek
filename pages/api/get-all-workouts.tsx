import type { NextApiRequest, NextApiResponse } from 'next';

interface Meal {
    id: string;
    title: string;
    content: string;
    calories: number;
    // Add any other fields that may be present in the response
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = Meal[] | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {
            const fetchSuggestedMealsUrl = `${process.env.WORDPRESS_API_URL}/workouts/v1/list/`;
            const response = await fetch(fetchSuggestedMealsUrl);

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (get-all-workouts)' });
            }

            const data: Meal[] = await response.json();

            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
