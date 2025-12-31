import express from "express";
import cookieParser from "cookie-parser";
import axios from "axios";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/webhooks', async (req, res) => {
    const { userId, amount, token } = req.body;
    await axios.post('http://localhost:3000/dbUpdate', { userId, amount, token });
});
app.listen(3002, () => {
    console.log(`listening at port 3002`);
});
//# sourceMappingURL=index.js.map