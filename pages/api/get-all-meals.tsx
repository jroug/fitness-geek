export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

      try {

  
        const fetchSuggestedMealsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.WORDPRESS_API_URL}/wp/v2/meal?per_page=100&orderby=date&order=desc&_fields=id,title,content,calories`;
        const response = await fetch(fetchSuggestedMealsUrl);
        
        if (!response.ok) {
          return res.status(401).json({ message: 'Authentication failed (get-all-meals)' });
        }
  
        const data = await response.json();
        
        // console.log(data);
        
        return res.status(200).json(data);

      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
    } else {
      return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

  }
  