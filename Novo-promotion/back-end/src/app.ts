import cors from 'cors'
import express from 'express'
import process from 'node:process'
import swaggerUi from 'swagger-ui-express'
import catalogRoutes from './routes/catalog.routes.js'
import healthRoutes from './routes/health.routes.js'
import { rotaNaoEncontrada, tratarErro } from './errors/error-handler.js'
import { requestId } from './middleware/request-id.js'
import openApiSpec from './openapi.js'
import { healthHandler } from './controllers/health.controller.js'

const app = express()
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:8080')
  .split(',')
  .map((origin) => origin.trim())

app.use(requestId)
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin))
  },
}))
app.use(express.json({ limit: '1mb' }))
app.get('/api/openapi.json', (request, response) => response.json(openApiSpec))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Food Promotion API — Swagger UI',
}))
app.get('/api/health', healthHandler)
app.use('/api/v1', healthRoutes, catalogRoutes)

app.use(rotaNaoEncontrada)
app.use(tratarErro)

export default app
