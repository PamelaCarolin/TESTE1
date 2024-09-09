// api/cart.js
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM carrinho WHERE user_id = $1', [userId]);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Erro ao buscar itens do carrinho:', err);
      res.status(500).json({ error: 'Erro ao buscar o carrinho' });
    }
  } else if (req.method === 'POST') {
    const { produtoId, quantidade } = req.body;
    try {
      await pool.query(
        'INSERT INTO carrinho (user_id, produto_id, quantidade) VALUES ($1, $2, $3)',
        [userId, produtoId, quantidade]
      );
      res.status(200).json({ message: 'Produto adicionado ao carrinho' });
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
