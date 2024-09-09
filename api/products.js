// api/products.js
import { Pool } from 'pg'; // Ou outro client de banco de dados que estiver usando

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // O porto do banco de dados, para PostgreSQL por exemplo
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Buscar todos os produtos
      const result = await pool.query('SELECT * FROM produtos');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Erro ao buscar os produtos:', err);
      res.status(500).json({ error: 'Erro ao buscar os produtos' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
