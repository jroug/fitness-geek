import type { NextApiRequest, NextApiResponse } from 'next';

interface JR_Token {
    jr_token: string;
    is_guest_watching: boolean;
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
            
            const checkPublicCalendarToken = `${process.env.WORDPRESS_API_URL}/jr_tokens/v1/calendar/token/check?jr_token=${req.query.jr_token}`;
            // console.log(checkPublicCalendarToken);
            const response = await fetch(checkPublicCalendarToken,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
 
            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (check-user-calendar)' });
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
