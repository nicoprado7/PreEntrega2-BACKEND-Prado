// config/path.config.js
import path from 'path';

const paths = {
    publicPath: path.join(process.cwd(), 'public'),
    productsFilePath: path.join(process.cwd(), 'products.json')
};

export default paths;
