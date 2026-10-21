import 'dotenv/config'
import pg from 'pg'
import process from 'node:process'

const { Pool } = pg

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'food_promotion',
  user: process.env.PGUSER || 'food_promotion',
  password: process.env.PGPASSWORD,
})

export async function testarConexaoBanco() {
  const resultado = await pool.query('SELECT 1 AS conectado')
  return resultado.rows[0]
}
