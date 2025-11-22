import { NextApiRequest, NextApiResponse } from 'next';

const profile = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Ambil data profile pengguna dari database atau penyimpanan
    const userProfile = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '08123456789',
    };

    res.status(200).json(userProfile);
  } else if (req.method === 'PUT') {
    const { name, phone } = req.body;
    
    // Update data profile di database atau penyimpanan
    // Simpan perubahan profile ke database
    
    res.status(200).json({ message: 'Profile updated successfully', user: { name, phone } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default profile;