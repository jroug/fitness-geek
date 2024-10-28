import type { NextApiRequest, NextApiResponse } from 'next';

interface LoginRequestBody {
    username: string;
    password: string;
}

interface SuccessResponse {
    message: string;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'POST') {
        const { username, password } = req.body as LoginRequestBody;

        try {
            const wpApiUrl = `${process.env.WORDPRESS_API_URL}`;
            const loginFetchUrl = `${wpApiUrl}/jwt-auth/v1/token`;

            const response = await fetch(loginFetchUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            const data = await response.json();
            const { token } = data;

            // Set token in cookies
            res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict;`);

            return res.status(200).json({ message: 'Logged in successfully' });
        } catch {
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
