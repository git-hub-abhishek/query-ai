// esmodule top flag

import * as express from "express";

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});