// esmodule top flag

import * as express from "express";
import * as path from "path";

const app = express();
const port = 3001;
const frontend_path = process.env.FRONTEND_PATH || path.join(__dirname, '/assets/web');



app.get('/', (req, res) => {
    res.sendFile(path.join(frontend_path, '/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});