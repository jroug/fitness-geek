import type { NextApiRequest, NextApiResponse } from 'next';

interface SuccessResponse {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResponse>) {
    res.setHeader(
        'Set-Cookie',
        'token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;'
    );
    return res.status(200).json({ message: 'Logged out successfully' });
}
