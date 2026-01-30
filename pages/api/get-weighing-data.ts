import type { NextApiRequest, NextApiResponse } from 'next';

 

interface ErrorResponse {
    message: string;
}

type ApiResponse = UserWeighingData[] | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {

            const token = req.cookies.token;

            const { startDate, endDate } = req.query;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const params = new URLSearchParams();

            if (typeof startDate === 'string') {
                params.append('startDate', startDate);
            }

            if (typeof endDate === 'string') {
                params.append('endDate', endDate);
            }

            const fetchUserWeighingsUrl = `${process.env.WORDPRESS_API_URL}/charts/v1/data/weightings/user/me${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await fetch(fetchUserWeighingsUrl,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (get-user-weighings)' });
            }

            const data: UserWeighingData[] = await response.json();

            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}