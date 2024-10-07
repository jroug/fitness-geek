export default async function handler(req, res) {

    if (req.method === 'POST') {
      const { username, password } = req.body;
      // console.log(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`);

      try {
        
        const response = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        console.log(response.body);
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
  
        const data = await response.json();
        const { token } = data;
  
        // Set token in cookies
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`);
        
        return res.status(200).json({ message: 'Logged in successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

  }
  