const readToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header is missing' });
    }

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    req.token = token;
    next();
};

export { readToken };