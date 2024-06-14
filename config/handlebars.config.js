// config/handlebars.config.js
import exphbs from 'express-handlebars';
import path from 'path';

const configureHandlebars = (app) => {
    const handlebarsInstance = exphbs.create({});
    app.engine('handlebars', handlebarsInstance.engine);
    app.set('view engine', 'handlebars');
    app.set('views', path.join(process.cwd(), 'views'));
};

export default configureHandlebars;
