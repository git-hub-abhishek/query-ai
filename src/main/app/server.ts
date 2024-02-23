// esmodule top flag

import * as express from "express";
import { SelectController } from "./controllers/select-controller";
import { openaiConnectService } from "./services/openaiConnectService";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const frontend_path = path.join(__dirname, '/ass');


app.get('/select', async (req, res) => {
    var  select = new SelectController(new openaiConnectService());
    await select.handleEvent(req, res);
});
app.get('/', (req, res) => {
    res.sendFile(path.join(frontend_path, '/index.html'));
});

app.listen(port, () => {
    
    console.log(`Server is running on port ${port}`);
});