interface ISoftDeletedItem {
    deleted: boolean;
}

export interface IProductStock {
    available: number;
    reserved: number;
    location: string;
}

export interface IProduct extends ISoftDeletedItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: IProductStock;
    tags: string[];
    rating: number;
}

export interface IProductJSON {
    products: IProduct[];
}