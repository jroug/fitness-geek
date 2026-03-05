import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateFoodResponse =
    | { message: string; updated: true; food: unknown }
    | { message: string; updated?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateFoodResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const fid = req.query.fid;
        if (!fid || Array.isArray(fid)) {
            return res.status(400).json({ message: 'Invalid food id' });
        }

        const updateFoodUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/update-food?fid=${encodeURIComponent(fid)}`;
        const response = await fetch(updateFoodUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to update food' });
        }

        return res.status(200).json({
            message: data?.message || 'Food updated successfully',
            updated: !!data?.updated,
            food: data?.food,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
