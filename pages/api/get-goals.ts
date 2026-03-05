import type { NextApiRequest, NextApiResponse } from 'next';

interface GoalRow {
    id: number;
    user_id: number;
    title: string;
    goal_type: string;
    target_value: string | number;
    current_value: string | number;
    unit: string;
    period_type: string;
    start_date: string;
    end_date: string | null;
    status: string;
    notes: string | null;
    created_at?: string;
    updated_at?: string;
    completed_at?: string | null;
    show_in_calendar?: boolean | number;
    show_in_dashboard?: boolean | number;
}

type ApiResponse = GoalRow[] | { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const goalsUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/get-goals`;
        const response = await fetch(goalsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Failed to fetch goals' });
        }

        const data: GoalRow[] = await response.json();
        return res.status(200).json(Array.isArray(data) ? data : []);
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
}
