import type { NextApiRequest, NextApiResponse } from 'next';

type AddFoodApiResponse =
    | { message: string; food_added: true; food: unknown }
    | { message: string; food_added?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<AddFoodApiResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const addFoodUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-food/`;
        const response = await fetch(addFoodUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to add food' });
        }

        return res.status(200).json({
            message: data?.message || 'Food added successfully',
            food_added: !!data?.food_added,
            food: data?.food,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
