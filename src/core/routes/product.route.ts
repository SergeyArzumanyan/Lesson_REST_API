import express from 'express';

import {
    createProduct,
    getProductById,
    getProducts,
    updateProductById,
    deleteProductById
} from "../controllers/product.controller";

export const productsRouter = express.Router();

productsRouter.post('/', createProduct);
productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProductById);
productsRouter.put('/:id', updateProductById);
productsRouter.delete('/:id', deleteProductById);
