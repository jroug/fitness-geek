import type { NextApiRequest, NextApiResponse } from 'next';

interface JR_Token {
    jr_token: string;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = JR_Token[] | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const createPublicCalendarToken = `${process.env.WORDPRESS_API_URL}/jr_tokens/v1/calendar/token/create`;
            const response = await fetch(createPublicCalendarToken,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
 
            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (create-user-calendar-token)' });
            }

            const data: JR_Token[] = await response.json();

            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
