// pages/api/check-auth.ts (API Route)

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface AuthResponse {
    message: string;
    user?: string | JwtPayload;
}

// here you check only the http cookie
export default function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  if (req.method === 'GET') {
      try {
        // Get the token from cookies
        const token = req.cookies.token;
        const { acon } = req.query;


        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, SECRET_KEY) as string | JwtPayload;
        

        if (!decoded) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }


        // // Check if the token has expired
        // const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        // if (typeof decoded === 'object' && decoded.exp && decoded.exp < currentTime) {
        //   return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        // }
        // console.log('aaaaaa', decoded.data?.user?.roles?.includes('subscriber'));
        // console.log('aaaaaa', acon);

        if (typeof decoded === 'object' && decoded.data?.user?.roles?.includes('subscriber')) {
          return res.status(200).json({ message: 'Authenticated' });
        } else if (acon === '1' && typeof decoded === 'object' && decoded.data?.user?.roles?.includes('contributor')) {
          return res.status(200).json({ message: 'Authenticated' });
        }
    
        // If the token is valid, return authenticated status
        return res.status(401).json({ message: 'Unauthorized: Incorrect user role' });


      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Handle any other errors
        return res.status(500).json({ message: 'Internal server error' });
      }
  } else {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }
}
