import type { NextApiRequest, NextApiResponse } from 'next';

interface ProfileData {
    name: string;
    first_name: string;
    last_name: string;
    user_registered: string;
}

interface SuccessResponse {
    message: string;
    user_name: string;
    first_name: string;
    last_name: string;
    user_registered: string;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const profileDataFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.WORDPRESS_API_URL}/wp/v2/users/me`;

            const response = await fetch(profileDataFetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (profile-data)' });
            }

            const data: ProfileData = await response.json();

            return res.status(200).json({
                message: 'Logged in successfully',
                user_name: data.name,
                first_name: data.first_name,
                last_name: data.last_name,
                user_registered: data.user_registered,
            });
        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
