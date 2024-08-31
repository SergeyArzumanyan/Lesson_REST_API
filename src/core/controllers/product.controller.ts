import { Request, Response } from "express";

import { IProduct, IProductJSON } from "../../shared/interfaces/product.interface";
import { generateID, readProductsData, writeProductsData } from "../../shared/helpers/helpers";
import { HttpStatus } from "../../shared/enums/http-statuses.enum";


const productsJSONFilePath: string = '../../../assets/jsons/products.json';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct: IProduct = req.body;

        if (newProduct.stock.available < 0 || !Number.isInteger(newProduct.stock.available)) {
            res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Stock.available must be non-negative integer.' });
            return;
        }

        if (newProduct.price < 0) {
            res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Price must not be negative.' });
            return;
        }

        const productsJSON = readProductsData(productsJSONFilePath);

        newProduct.id = generateID(productsJSON);
        newProduct.deleted = false;

        productsJSON.products.push(newProduct);
        writeProductsData(productsJSONFilePath, productsJSON);

        res.status(HttpStatus.CREATED).json(newProduct);
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, isDeleted } = req.query;
        let products: IProduct[] = readProductsData(productsJSONFilePath).products;

        if (category) {
            products = products.filter((p: IProduct) => p.category === category);
        }

        if (isDeleted) {
            const isDeletedQueryConvertedToBoolean: boolean = isDeleted === 'true';
            products = products.filter((p: IProduct) => p.deleted === isDeletedQueryConvertedToBoolean);
        }

        res.status(HttpStatus.OK).json(products);
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const jsonData = readProductsData(productsJSONFilePath);

    const product = jsonData.products.find(p => p.id === id);

    if (product) {
        res.json(product);
    } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
    }
};

export const updateProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProduct: Partial<IProduct> = req.body;
        const productsJSON: IProductJSON = readProductsData(productsJSONFilePath);
        const products: IProduct[] = productsJSON.products;
        const idx: number = products.findIndex(p => p.id === id);

        if (idx === -1) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
            return;
        }

        const existingProduct: IProduct = products[idx];

        if (updatedProduct?.stock?.available) {
            if (updatedProduct.stock.available < 0 || !Number.isInteger(updatedProduct.stock.available)) {
                res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Stock.available must be a non-negative integer.' });
                return;
            }
        }

        if (updatedProduct?.price && updatedProduct?.price < 0) {
            res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Price must not be negative.' });
            return;
        }

        const updatedProductData: IProduct = {
            ...existingProduct,
            ...updatedProduct,
        };

        products[idx] = updatedProductData;

        writeProductsData(productsJSONFilePath, productsJSON);

        res.status(HttpStatus.OK).json(updatedProductData);
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

export const deleteProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productsJSON: IProductJSON = readProductsData(productsJSONFilePath);
        const products: IProduct[] = productsJSON.products;
        const idx: number = products.findIndex(p => p.id === id);

        if (idx === -1) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
            return;
        }

        const product: IProduct = products[idx];

        product.deleted = true;

        writeProductsData(productsJSONFilePath, productsJSON);

        res.status(HttpStatus.OK).json(product);

    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};
