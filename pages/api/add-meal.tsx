export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {

    //   console.log(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/users/${user_id}`);

      try {

        const token = req.cookies.token;
        const addMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/fitnessgeek-api/v1/add-meal/`;
        const response = await fetch(addMealsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token here
            },
            body: JSON.stringify(req.body)
        });

        
        if (response.status === 400) {
            return res.status(400).json({ message: 'Empty fields' });
        }
        
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed (add-meal)' });
        }
  
        const data = await response.json();
        
        // console.log(data);
        
        return res.status(200).json({ 
            message: 'Meal Added successfully',
            user_meal_added: true
        });

      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

  }
  