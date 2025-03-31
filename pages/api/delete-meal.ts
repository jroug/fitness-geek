import type { NextApiRequest, NextApiResponse } from 'next';

interface DeleteResponse {
    message: string;
    deleted: string;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = DeleteResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Only DELETE requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const { mids } = req.query;
        if (!mids || typeof mids !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing meal IDs' });
        }

        const deleteMealsUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/delete-meal?mids=${mids}`;

        const response = await fetch(deleteMealsUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Failed to delete meal(s)' });
        }

        const data: DeleteResponse = await response.json();
        return res.status(200).json(data);

    } catch (error: unknown) {
        console.error('Server error:', error);

        // Ensure error is properly casted before accessing properties
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(500).json({ message: `Server error: ${errorMessage}` });
    }
}