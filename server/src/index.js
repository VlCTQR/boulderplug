import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;
import auth from './routes/auth/auth.js';
import products from "./routes/products/products.js";
import users from "./routes/users/users.js";

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/products", products);
app.use("/users", users);

app.get('/', (req, res) => {
  console.log(req);
  // res.send('Hello World!')
  res.json({ msg: "hello world"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});