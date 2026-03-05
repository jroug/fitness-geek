import type { NextApiRequest, NextApiResponse } from 'next';

type DeleteFoodResponse =
    | { message: string; deleted: true }
    | { message: string; deleted?: false };

export default async function handler(req: NextApiRequest, res: NextApiResponse<DeleteFoodResponse>) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Only DELETE requests are allowed' });
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

        const deleteFoodUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/delete-food?fid=${encodeURIComponent(fid)}`;
        const response = await fetch(deleteFoodUrl, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.message || 'Failed to delete food' });
        }

        return res.status(200).json({
            message: data?.message || 'Food deleted successfully',
            deleted: !!data?.deleted,
        });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
