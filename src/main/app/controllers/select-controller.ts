// add a async HandleEvent method to the class
// add a constructor to the class
// add a private readonly property to the class
// add a private readonly property to the class

import { openaiConnectService } from '../services/openaiConnectService';

export class SelectController {
    private readonly openaiConnectService: openaiConnectService;

    constructor(selectService: openaiConnectService) {
        this.openaiConnectService = selectService;
    }

    public async handleEvent(query: string) {
        const result = await this.openaiConnectService.query(query);
        // set the response status code to 200 (OK) and body here
        return result;
    }
}



//export the class
