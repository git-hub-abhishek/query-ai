import { OpenAICompletionService } from '../src/main/app/services/openai-completion-service';

describe('openaiCompletionService', () => {
  let service : OpenAICompletionService;

  beforeEach(() => {
    service = new OpenAICompletionService();
  });

  it('should return a completion', async () => {
    const prompt = 'Translate the following English text to French: "{ text: "Hello, world!" }"';
    const completion = await service.queryWithCompletion(prompt);

    expect(completion).toBeDefined();
    expect(typeof completion).toBe('string');
  });
});