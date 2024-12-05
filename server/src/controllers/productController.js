import productData from '../dataModules/productsModule.js';
import users from '../dataModules/usersModule.js';
import {BadRequestError, NotFoundError} from "../Errors.js";

const { products, brands, levels, closing, colors } = productData;

const getIndexOfProduct = (id) => {
    return products.findIndex(product => product.id === id);
};

// Get product by id
const getProductById = (id) => {
    const product = products.find(product => product.id === parseInt(id));
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    return product;
};

// Get filtered products
const getFilteredProducts = (filters, searchedProducts) => {
    const { brands, levels, closing: closingOption, toepatch, colors } = filters;

    console.log(toepatch);

    let filteredProducts;

    if (searchedProducts) {
        filteredProducts = searchedProducts;
    } else {
        filteredProducts = products;
    }

    if (brands) {
        const brandArray = brands.split(",");
        filteredProducts = filteredProducts.filter(product => brandArray.includes(product.brand));
    }

    if (levels) {
        const levelArray = levels.split(",");
        filteredProducts = filteredProducts.filter(product => levelArray.includes(product.level));
    }

    if (closingOption) {
        filteredProducts = filteredProducts.filter(product => product.closing === closingOption);
    }

    if (toepatch !== null && toepatch !== undefined) {
        filteredProducts = filteredProducts.filter(product => {
            const toepatchBoolean = toepatch === 'true';
            return product.toepatch === toepatchBoolean;
        });
    }




    if (colors) {
        const colorArray = colors.split(",");
        filteredProducts = filteredProducts.filter(product => colorArray.some(color => product.colors.includes(color)));
    }

    return filteredProducts;
};

// Get filter options
const getFilterOptions = () => {
    return {
        brands,
        levels,
        closing,
        colors
    };
};

// Handle new bid
const postNewBid = (amount, product, user) => {
    const productIndex = getIndexOfProduct(product.id);

    // Check if auction is closed
    if (product.dateOfSale < Date.now()){
        throw new BadRequestError('Bidding is closed');
    }

    // Check if bid is higher than current bid
    if (product.bids.length > 0 && amount <= product.bids[0].bid) {
        throw new BadRequestError('Bid must be higher than current bid');
    }

    // Add new bid to product.bids at index 0
    product.bids.unshift({
        userId: user.id,
        bid: amount
    });

    // Update product
    products[productIndex] = product;

    return product;
};

// Get bids of a product
const getBids = async (product) => {
    return await Promise.all(product.bids.map(async (bid) => {
            const user = users.find(user => user.id === bid.userId);
            return {
                bid: bid.bid,
                userId: bid.userId,
                userName: user.name
            };
        })
    );
};

const getBidInfo = async (bid, productId) => {
    const product = getProductById(productId);
    const bids = await getBids(product);
    return bids.find(b => b.bid === bid);
};

// Post new product
const postNewProduct = (product) => {
    const parsedProduct = validateProductData(product);
    products.push(parsedProduct);
    return parsedProduct;
};

// Validate product data
const validateProductData = (product) => {
    const { name, description, brand,images, level, toepatch, dateOfSale, colors } = product;

    // Check if required fields are given
    if (!name || !description || !brand || !level || !closing || !colors || !images || !dateOfSale) {
        throw new BadRequestError('Missing required fields');
    }

    // Check if fields are of good type
    if (
        typeof name !== 'string' ||
        typeof description !== 'string' ||
        typeof brand !== 'string' ||
        typeof level !== 'string' ||
        !Array.isArray(closing) ||
        !closing.every(item => typeof item === 'string') ||
        typeof toepatch !== 'boolean' ||
        typeof dateOfSale !== 'string' ||
        !Array.isArray(colors) ||
        !colors.every(color => typeof color === 'string') ||
        !Array.isArray(images) ||
        !images.every(image => typeof image === 'string')
    ) {
        throw new BadRequestError('Invalid data types given');
    }

    // Check if date of sale is following the correct format
    const parsedDate = Date.parse(dateOfSale);
    if (isNaN(parsedDate)) {
        throw new BadRequestError('Invalid dateOfSale');
    }

    const dateOfSaleFormatted = new Date(parsedDate);

    if (!levels.includes(level)) {
        throw new BadRequestError('Invalid level provided');
    }

    if (!closing.every(option => closing.includes(option))) {
        throw new BadRequestError('Invalid closing options provided');
    }

    if (!colors.every(color => colors.includes(color))) {
        throw new BadRequestError('Invalid colors provided');
    }

    if (!brands.includes(brand)) { // If brand is not in list => add to list
        brands.push(brand);
    }

    // New product
    const id = Math.max(...products.map(product => product.id)) + 1;
    return {
        id: id,
        name: name,
        description: description,
        brand: brand,
        level: level,
        closing: closing,
        toepatch: toepatch,
        colors: colors,
        images,
        dateOfSale: dateOfSaleFormatted,
        bids: [],
    };
};

// Delete product
const deleteProduct = (id) => {
    const productIndex = getIndexOfProduct(id);
    if (productIndex === -1) {
        throw new NotFoundError('Product not found');
    }
    const deletedProduct = products.splice(productIndex, 1);
    return deletedProduct[0];
};

// Update product
const updateProduct = (id, updatedProduct) => {
    const productIndex = getIndexOfProduct(id);

    const parsedProduct = validateProductData(updatedProduct);
    parsedProduct.id = id;
    products[productIndex] = parsedProduct;
    return parsedProduct;
};

// Search products by name, brand, or description
const searchProducts = (searchString) => {
    if (!searchString) {
        throw new BadRequestError('Search string cannot be empty');
    }

    // Split into words
    const searchWords = searchString.toLowerCase().split(' ');

    // Filter products
    const foundProducts = products.filter(product => {
        const name = product.name.toLowerCase();
        const brand = product.brand.toLowerCase();
        const description = product.description.toLowerCase();

        return searchWords.some(word =>
            name.includes(word) || brand.includes(word) || description.includes(word)
        );
    });

    if (foundProducts.length === 0) {
        throw new NotFoundError('No products found');
    }

    return foundProducts;
};

export { searchProducts, getProductById, getIndexOfProduct, getFilteredProducts, getFilterOptions, postNewBid, getBids, getBidInfo,postNewProduct, deleteProduct, updateProduct  };