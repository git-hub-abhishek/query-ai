import OpenAI from "openai";

import { ReadLine, createInterface } from "readline";



export class openaiConnectService {

  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  private readline: ReadLine = createInterface({
    input: process.stdin,
    output: process.stdout,
  });


  private  askQuestion(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.readline.question(question, (answer) => {
        resolve(answer);
      });
    });
  }


  
  constructor() {
    console.log("openaiConnectService constructor");
  }


  public async initialise(): Promise<void> {
    try {
      console.log("inside assistant block");
      // Creating the assistant
      const mathTutorAssistant = await this.openai.beta.assistants.create({
        name: "Math Tutor",
        instructions:
          "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-turbo-preview",
      });

      const mathTutorAssistantId = mathTutorAssistant.id;
      console.log("assistant id is:", mathTutorAssistantId);

      console.log(
        "\nHello there, I'm your personal math tutor. Ask some complicated questions.\n"
      );

      const thread = await this.openai.beta.threads.create();
      const threadId = thread.id;
      console.log("the thread id is:", threadId);

      let keepAsking = true;
      
      while (keepAsking) {
        const userQuestion = await this.askQuestion("\nWhat is your question? ");
        await this.openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userQuestion,
        });

        const run = await this.openai.beta.threads.runs.create(threadId, {
          assistant_id: mathTutorAssistantId,
        });

        let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);

        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
        }

        const messages = await this.openai.beta.threads.messages.list(threadId);
        const lastMessageForRun = messages.data
          .filter(
            (message) =>
              message.run_id === run.id && message.role === "assistant"
          )
          .pop();

        if (lastMessageForRun) {
          console.log(lastMessageForRun.content);
        }

        const continueAsking = await this.askQuestion(
          "Do you want to ask another question? (yes/no) "
        );
        keepAsking = continueAsking.toLowerCase() === "yes";

        if (!keepAsking) {
          console.log("Alrighty then, I hope you learned something!\n");
        }
      }

      this.readline.close();
    } catch (error) {
      console.error("Error calling ChatCompletion API:", error);
      throw error;
    }
  }
}
