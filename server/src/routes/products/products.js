import express from "express";
import crypto from "crypto";
const router = express.Router();
import {
    deleteProduct, getBids,
    getFilteredProducts,
    getFilterOptions, getBidInfo,
    getProductById,
    postNewBid, postNewProduct, updateProduct, searchProducts
} from "../../controllers/productController.js";
import {getHttpStatusCode} from "../../Errors.js";
import {authorizeAdmin, authorizeUser} from "../../controllers/authController.js";
import {readToken} from "../auth/authMiddleware.js";

const productChannels = new Map();

const distributeNewBid = async (bid, productId) => {
    try {
        const bidInfo = await getBidInfo(bid, productId);
        const message = {
            bid: bidInfo.bid,
            userId: bidInfo.userId,
            userName: bidInfo.userName
        };

        const productUserChannels = productChannels.get(productId.toString());

        if (productUserChannels) {
            for (const [channelId, channel] of productUserChannels) {
                const {stream} = channel;

                if (stream) {
                    console.log("New bid is notified:", message);
                    stream.write(`data: ${JSON.stringify(message)}\n\n`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
};



router.post("/:id/bids", readToken, async (req, res) => {
    try {
        const product = getProductById(req.params.id);
        const bid = req.body.bid;
        const user = await authorizeUser(req.token);
        const updatedProduct = postNewBid(bid, product, user);
        await distributeNewBid(bid, parseInt(req.params.id));
        res.status(201).json(updatedProduct);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});
router.get("/:id/bids", async (req, res) => {
    try {
        const product = getProductById(req.params.id);
        const bids = await getBids(product);
        res.status(200).json(bids);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});

router.get("/:id/bid/:channelId", (req, res) => {
    const productId = req.params.id;
    const channelId = req.params.channelId;

    const channel = productChannels.get(productId)?.get(channelId);

    if (channel && !channel.stream) {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Connection", "keep-alive");

        res.flushHeaders();

        res.on("close", () => {
            if (productChannels.get(productId)?.get(channelId)){
                productChannels.get(productId).delete(channelId);
            }
        });

        channel.stream = res;
    } else {
        res.status(400).end();
    }
});

router.post("/:id/bid/subscribe", (req, res) => {
    const productId = req.params.id;

    try {
        getProductById(productId);

        const userChannelId = crypto.randomUUID();

        // Check if productId already exists in productChannels
        if (!productChannels.has(productId)) {
            productChannels.set(productId, new Map()); // Make new map for user channels
        }

        const userChannels = productChannels.get(productId);

        // Create new user channel
        userChannels.set(userChannelId, { stream: null });

        res.status(201).json({ message: "Subscribed", channelId: userChannelId });
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({ message: e.message });
    }
});


router.get("/", (req, res) => {
    let filteredProducts;
    try {
        if (req.query.search) {
            // Search products by search query
            filteredProducts = searchProducts(req.query.search);

            // If user gave filters, apply them to search results
            filteredProducts = getFilteredProducts(req.query, filteredProducts);
        } else {
            // Filter products based on query params
            filteredProducts = getFilteredProducts(req.query);
        }

        res.status(200).json(filteredProducts);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({ message: e.message });
    }
});

router.get("/options", (req, res) => {
    const options = getFilterOptions();
    res.status(200).json(options);
});
router.get("/:id", (req, res) => {
    try {
        const product = getProductById(req.params.id);

        res.status(200).json(product);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({ message: e.message });
    }
});

router.post("/", readToken, async (req, res) => {
    try {
        const user = await authorizeUser(req.token);
        authorizeAdmin(user);

        const product = postNewProduct(req.body);

        res.status(201).json(product);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});
router.delete("/:id", readToken, async (req, res) => {
    try {
        const user = await authorizeUser(req.token);
        authorizeAdmin(user);
        const deletedProduct = deleteProduct(parseInt(req.params.id));
        res.status(200).json(deletedProduct);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});
router.put("/:id", readToken, async (req, res) => {
    try {
        const user = await authorizeUser(req.token);
        authorizeAdmin(user);
        const updatedProduct = updateProduct(req.params.id, req.body);
        res.status(201).json(updatedProduct);
    } catch (e) {
        return res.status(getHttpStatusCode(e)).json({message: e.message});
    }
});

export default router;