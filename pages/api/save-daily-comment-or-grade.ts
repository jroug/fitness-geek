import type { NextApiRequest, NextApiResponse } from 'next';

interface UpdateResponse {
  message: string;
  user_meal_updated: boolean;
}

interface ErrorResponse {
  message: string;
}

type ApiResponse = UpdateResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

    if (req.method === 'POST') {

      // console.log(`${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-meal/`);

      try {
        const token = req.cookies.token;
        const saveDailyCommentUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/save-daily-comment-or-grade`;
        const response = await fetch(saveDailyCommentUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token here
            },
            body: JSON.stringify(req.body)
        });
 
    
    //   console.log(saveDailyCommentUrl);

        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed (save-daily-comment-or-grade)' });
        }
  
        if (response.status === 400) {
          return res.status(400).json({ message: 'Empty fields' });
        }

        const data: UpdateResponse = await response.json();
        return res.status(200).json(data);

      } catch {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

}
  