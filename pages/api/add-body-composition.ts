import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const token = req.cookies.token;
            const addBodyCompositionUrl = `${process.env.WORDPRESS_API_URL}/fitnessgeek-api/v1/add-bodycomposition/`;
            const response = await fetch(addBodyCompositionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(req.body)
            });

            if (response.status === 400) {
                return res.status(400).json({ message: 'Empty fields' });
            }

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed (add-body-composition)' });
            }

            return res.status(200).json({ 
                message: 'Body composition added successfully',
                bodycomposition_added: true
            });
        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
