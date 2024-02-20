// esmodule top flag

import * as express from "express";
import { SelectController } from "./controllers/select-controller";
import { openaiConnectService } from "./services/openaiConnectService";

const app = express();
const port = 3001;

app.get('/select', (req, res) => {
    var  select = new SelectController(new openaiConnectService());
    select.handleEvent(req, res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});