// add a async HandleEvent method to the class
// add a constructor to the class
// add a private readonly property to the class
// add a private readonly property to the class

import { Request, Response } from 'express';
import { openaiConnectService } from '../services/openaiConnectService';

export class SelectController {
    private readonly openaiConnectService: openaiConnectService;

    constructor(selectService: openaiConnectService) {
        this.openaiConnectService = selectService;
    }

    async handleEvent(req: Request, res: Response) {
        const result = await this.openaiConnectService.initialise();
        // set the response status code to 200 (OK) and body here
        res.send(result);
    }
}



//export the class
