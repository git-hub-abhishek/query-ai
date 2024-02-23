// esmodule top flag

import * as express from "express";
import { SelectController } from "./controllers/select-controller";
import { openaiConnectService } from "./services/openaiConnectService";
import * as path from "path";
import * as dotenv from "dotenv";
import { json } from "body-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const frontend_path = path.join(__dirname, '/assets/web');
app.use(json());


app.post('/select', async (req, res) => {

    

    //add code for reading the request body
    console.log("inside select block"+req);
    var  select = new SelectController(new openaiConnectService());
    res.send(await select.handleEvent(req.body.query));
    
});
app.get('/', (req, res) => {
    res.sendFile(path.join(frontend_path, '/index.html'));
});

app.listen(port, () => {
    
    console.log(`Server is running on port ${port}`);
});