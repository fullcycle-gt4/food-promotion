import 'dotenv/config'
import process from 'node:process'
import app from './app.js'

const port = Number(process.env.PORT) || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Food Promotion API disponível em http://localhost:${port}`)
})
