import path from "path";
import fs from "fs";

import { IProductJSON } from "../interfaces/product.interface";

export const generateID = (jsonData: IProductJSON): string => {
    const maxId = Math.max(...jsonData.products.map(p => parseInt(p.id)));

    return (maxId + 1).toString();
};

export const writeProductsData = (filePath: string, jsonContents: IProductJSON): void => {
    const jsonPath = path.join(__dirname, ...filePath.split('/'));

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContents, null, 2));
};

export const readProductsData = (filePath: string) => {
    const jsonPath = path.join(__dirname, ...filePath.split('/'));
    const data = fs.readFileSync(jsonPath, 'utf8');

    return JSON.parse(data) as IProductJSON;
};