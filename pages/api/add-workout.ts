import type { NextApiRequest, NextApiResponse } from 'next';

 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {

     //  console.log(`${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-meal/`);

      try {

        const token = req.cookies.token;
        const addWorkoutUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-workout/`;
        const response = await fetch(addWorkoutUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token here
            },
            body: JSON.stringify(req.body)
        });

        if (response.status === 400) {
            return res.status(400).json({ message: 'Empty fields' });
        }
        
        if (response.status === 409) {
            return res.status(409).json({ message: 'Workout already exists for this date', code: 'workout_exists' });
        }
        
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed (add-workout)' });
        }
  
        // const data = await response.json();
        // console.log(data);
        
        return res.status(200).json({ 
            message: 'Workout Added successfully',
            user_workout_added: true
        });

      } catch {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

  }
  