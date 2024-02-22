import OpenAI from "openai";
import * as dotenv from "dotenv";
import { ReadLine, createInterface } from "readline";

dotenv.config();
const OPENAI_API_KEY: string = "xxxxxxxxx";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

//an interface for reading input from the command line (stdin) and writing output to the command line (stdout).
const readline: ReadLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

export class openaiConnectService {
  async initialise(): Promise<void> {
    try {
      console.log("inside assistant block");
      // Creating the assistant
      const mathTutorAssistant = await openai.beta.assistants.create({
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

      const thread = await openai.beta.threads.create();
      const threadId = thread.id;
      console.log("the thread id is:", threadId);

      let keepAsking = true;
      
      while (keepAsking) {
        const userQuestion = await askQuestion("\nWhat is your question? ");
        await openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userQuestion,
        });

        const run = await openai.beta.threads.runs.create(threadId, {
          assistant_id: mathTutorAssistantId,
        });

        let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        }

        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessageForRun = messages.data
          .filter(
            (message) =>
              message.run_id === run.id && message.role === "assistant"
          )
          .pop();

        if (lastMessageForRun) {
          console.log(lastMessageForRun.content);
        }

        const continueAsking = await askQuestion(
          "Do you want to ask another question? (yes/no) "
        );
        keepAsking = continueAsking.toLowerCase() === "yes";

        if (!keepAsking) {
          console.log("Alrighty then, I hope you learned something!\n");
        }
      }

      readline.close();
    } catch (error) {
      console.error("Error calling ChatCompletion API:", error);
      throw error;
    }
  }
}
