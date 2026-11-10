import { Router } from 'express'
import {
  listarCategorias,
  listarProdutos,
  obterProduto,
} from '../controllers/catalog.controller.js'

const router = Router()
router.get('/categories', listarCategorias)
router.get('/products', listarProdutos)
router.get('/products/:id', obterProduto)

export default router
