
export default async function handler(req, res) {

    if (req.method === 'POST') {

      const { username, password } = req.body;

      try {
        
        const wpApiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.WORDPRESS_API_URL}`;
        const loginFetchUrl = `${wpApiUrl}/jwt-auth/v1/token`;
        // console.log('loginFetchUrl', loginFetchUrl);
        const response = await fetch(loginFetchUrl, {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        // console.log(response.body);
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
  
        const data = await response.json();
        const { token } = data;
  
        // Set token in cookies
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict;`);
        
        return res.status(200).json({ message: 'Logged in successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

  }
  