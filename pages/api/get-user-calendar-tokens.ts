import type { NextApiRequest, NextApiResponse } from 'next';

interface JR_Token {
    token: string;
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

            const fetchPublicCalendarToken = `${process.env.WORDPRESS_API_URL}/jr_tokens/v1/calendar/token/get`;
            const response = await fetch(fetchPublicCalendarToken,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('createPublicCalendarToken', fetchPublicCalendarToken);
            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (get-user-calendar)' });
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
