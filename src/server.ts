import express from 'express';

import { productsRouter } from './core/routes/product.route';

const app = express();
const PORT: number = 3001;


app.use(express.json());

app.use('/products', productsRouter);


app.listen(PORT, () => console.log(`See API on  http://localhost:${ PORT }/products`));
