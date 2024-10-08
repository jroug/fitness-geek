// pages/api/check-auth.ts (API Route)

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY; // Use a strong secret key

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    // Get the token from cookies
    const token = req.cookies.token;

    console.log(req.cookies);

    // If no token is found, return unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    // If the token is valid, return authenticated status
    return res.status(200).json({ message: 'Authenticated', user: decoded });
  } catch (error) {
    // If token verification fails or an error occurs, return unauthorized
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}