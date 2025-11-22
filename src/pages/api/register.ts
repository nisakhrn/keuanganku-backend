import { NextApiRequest, NextApiResponse } from 'next';

const register = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    
    // Simpan data registrasi ke database atau data mock
    // Contoh: Menyimpan data pengguna ke MongoDB (misalnya)
    // Database logic here to insert user

    res.status(201).json({ message: 'Registrasi berhasil', user: { name, email } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default register;