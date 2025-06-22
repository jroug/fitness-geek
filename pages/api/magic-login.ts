import type { NextApiRequest, NextApiResponse } from 'next';

 

interface SuccessResponse {
    message: string;
    redirect_url: string;
}

interface ErrorResponse {
    message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'GET') {
        // Extract the login token from the query parameters
        const { login_token } = req.query;
        if (!login_token) {
            return res.status(400).json({ message: 'Login token is required' });
        }
        
        try {
            const wpApiUrl = `${process.env.WORDPRESS_API_URL}`;
            const magicLoginFetchUrl = `${wpApiUrl}/magic-auth/v1/magic-login?login_token=${encodeURIComponent(Array.isArray(login_token) ? login_token[0] : login_token)}`;

            const response = await fetch(magicLoginFetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            // console.log('magicLoginFetchUrl', magicLoginFetchUrl);
            if (!response.ok) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            const data = await response.json();
            // console.log('data', data);
            const { auth, redirect_url, token } = data;
            if (auth===true){
                // Set token in cookies
                res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict;`);
                return res.status(200).json({ message: 'Logged in successfully', redirect_url: redirect_url});
            }else{
                return res.status(401).json({ message: 'Authentication failed' });
            }
        } catch {
            return res.status(500).json({ message: 'Server error' });
        }

    } else {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }
}
