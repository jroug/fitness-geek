// pages/api/check-auth.ts (API Route)

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface AuthResponse {
    message: string;
    user?: string | JwtPayload;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  try {
    // Get the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY) as string | JwtPayload;

    // If the token is valid, return authenticated status
    return res.status(200).json({ message: 'Authenticated', user: decoded });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Handle any other errors
    return res.status(500).json({ message: 'Internal server error' });
  }
}
