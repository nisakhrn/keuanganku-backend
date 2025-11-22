import { NextApiRequest, NextApiResponse } from 'next';

const login = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Logika login (misalnya validasi dengan data mock atau database)
    if (email === "user@example.com" && password === "password") {
      res.status(200).json({ message: 'Login berhasil', user: { email } });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default login;