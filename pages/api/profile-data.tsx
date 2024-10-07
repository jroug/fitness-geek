export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

    //   console.log(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/${user_id}`);

      try {

        const token = req.cookies.token;

        const response = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/me`, {
          method: 'GET',
 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token here
          },
        });

        // console.log(response);
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed (profile-data)' });
        }
  
        const data = await response.json();
        
        // console.log(data);
        
        return res.status(200).json({ 
            message: 'Logged in successfully',
            user_name: data.name,
            first_name: data.first_name,
            last_name: data.last_name,
        });

      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

  }
  