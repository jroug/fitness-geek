import type { NextApiRequest, NextApiResponse } from 'next';

interface CalendarPublicData {
    user_display_name: string;
    meals_list: {
        ID: string;
        user_id: number;
        meal_id: number;
        meal_type: string;
        comments: string;
        datetime_of_meal: string;
        datetime_saved: string;
    }[];
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = CalendarPublicData[] | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {

            const getCalendarPublicDataUrl = `${process.env.WORDPRESS_API_URL}/jr_tokens/v1/calendar/public/data?jr_token=${req.query.jr_token}`;
            const response = await fetch(getCalendarPublicDataUrl,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (get-calendar-public-data)' });
            }

            const data: CalendarPublicData[] = await response.json();

            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
