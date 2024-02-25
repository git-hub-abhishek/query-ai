// add a async HandleEvent method to the class
// add a constructor to the class
// add a private readonly property to the class
// add a private readonly property to the class

import { OpenAICompletionService } from '../services/openai-completion-service';

export class SelectWithCompletionController {
    private readonly openaiCompletionService: OpenAICompletionService;

    constructor(selectService: OpenAICompletionService) {
        this.openaiCompletionService = selectService;
    }

    public async handleEvent(query: string) {
        const result = await this.openaiCompletionService.queryWithCompletion(query);
        // set the response status code to 200 (OK) and body here
        return result;
    }
}



//export the class
