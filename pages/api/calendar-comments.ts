import type { NextApiRequest, NextApiResponse } from 'next';

interface OpenCloseGetCalendarComments {
    message: string;
    status: boolean;
    action_suc: boolean;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = OpenCloseGetCalendarComments | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try { 
            const { action, jr_token } = req.query;
            const token = req.cookies.token;
            let calendarCommentsUrl = '';
            let headerJson = {}


            if (action!=='getCommentsStatus'){ // only calendar status can be public
                if (!token) {
                    return res.status(401).json({ message: 'Unauthorized: No token provided' });
                }
                calendarCommentsUrl = `${process.env.WORDPRESS_API_URL}/settings/v1/calendar/comments?action=${action}`;
                headerJson = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }else{
                calendarCommentsUrl = `${process.env.WORDPRESS_API_URL}/settings/v1/calendar/comments?action=${action}&jr_token=${jr_token}`;
                headerJson = {
                    'Content-Type': 'application/json',
                }
            }


            console.log('---------------------------------', calendarCommentsUrl);
            const response = await fetch(calendarCommentsUrl,{
                method: 'GET',
                headers: headerJson
            });

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (calendar-comments)' });
            }

            const data = await response.json();
            
            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}