import type { NextApiRequest, NextApiResponse } from 'next';

interface ProfileDataResponse {
    name: string;
    first_name: string;
    last_name: string;
    user_registered: string;
    email: string;
    acf: {
        date_of_birth?: string;
        profile_picture?: string;
    };
    fitness_stats?: {
        last_weighing?: number;
        last_weighing_date?: string;
        last_weekly_avg_weight?: number;
        this_weekly_avg_weight?: number;
        weekly_workouts_count?: number;
        this_week_avg_grade?: number;

        bodycomp_date?: Date;
        bodycomp_fat_percent?: number;
        bodycomp_fat?: number;
        bodycomp_fat_visceral?: number;
        bodycomp_waist?: number;
        bodycomp_weight?: number;
    }
}

 

interface ErrorResponse {
    message: string;
}

type ApiResponse = ProfileDataWithStats | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            const includeFitnessStats = req.query.include_fitness_stats === '1';

            const profileDataFetchUrl = `${process.env.WORDPRESS_API_URL}/wp/v2/users/me?context=edit&acf_format=standard${includeFitnessStats ? '&include_fitness_stats=1' : ''}`;
            // console.log(profileDataFetchUrl);
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

            const data: ProfileDataResponse = await response.json();

            return res.status(200).json({
                message: 'Logged in successfully',
                user_name: data.name,
                first_name: data.first_name,
                last_name: data.last_name,
                user_registered: data.user_registered,
                email: data.email,
                date_of_birth: data.acf.date_of_birth,
                profile_picture: data.acf.profile_picture,
                fitness_stats: {
                    last_weighing: data.fitness_stats?.last_weighing,
                    last_weighing_date: data.fitness_stats?.last_weighing_date,
                    last_weekly_avg_weight: data.fitness_stats?.last_weekly_avg_weight,
                    this_weekly_avg_weight: data.fitness_stats?.this_weekly_avg_weight,
                    weekly_workouts_count: data.fitness_stats?.weekly_workouts_count,
                    this_week_avg_grade: data.fitness_stats?.this_week_avg_grade,

                    bodycomp_date: data.fitness_stats?.bodycomp_date,
                    bodycomp_fat_percent: data.fitness_stats?.bodycomp_fat_percent,
                    bodycomp_fat: data.fitness_stats?.bodycomp_fat,
                    bodycomp_fat_visceral: data.fitness_stats?.bodycomp_fat_visceral,
                    bodycomp_waist: data.fitness_stats?.bodycomp_waist,
                    bodycomp_weight: data.fitness_stats?.bodycomp_weight
                }
            });
            
        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
