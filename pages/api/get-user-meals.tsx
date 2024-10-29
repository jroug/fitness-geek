import type { NextApiRequest, NextApiResponse } from 'next';

interface Meal {
    ID: string;
    user_id: number;
    meal_id: number;
    meal_type: string;
    comments: string;
    datetime_of_meal: string;
    datetime_saved: string;
    // Add any other fields that may be present in the response
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = Meal[] | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {

            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const fetchUserMealsUrl = `${process.env.WORDPRESS_API_URL}/foods/v1/list/user/me`;
            const response = await fetch(fetchUserMealsUrl,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
 
            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (get-user-meals)' });
            }

            const data: Meal[] = await response.json();

            return res.status(200).json(data);

        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
