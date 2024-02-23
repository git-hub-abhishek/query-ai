import OpenAI from "openai";
import * as fs from 'fs';

import { ReadLine, createInterface } from "readline";

export class openaiConnectService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // private readline: ReadLine = createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // private askQuestion(question: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     this.readline.question(question, (answer) => {
  //       resolve(answer);
  //     });
  //   });
  // }

  constructor() {
    console.log("openaiConnectService constructor");
  }

  public async query(userQuestion:string): Promise<string> {
    try {
      console.log("inside assistant block");

      // const file = await this.openai.files.create({
      //   file: fs.createReadStream("tx_db_schema.sql"),
      //   purpose: "assistants",
      // });

      // // Creating the assistant
      // const dbqueryAssistant = await this.openai.beta.assistants.create({
      //   name: "Database Expert",
      //   instructions:
      //     "You are an expert dba. Considering the File attached, you must generate SQL's to answer questions.",
      //   tools: [{ type: "code_interpreter" }],
      //   model: "gpt-4-turbo-preview",
      //   file_ids: ['file-fGxWXrAKGdIkCHnwnTvR2ZWE']
      // });

      const dbqueryAssistantId = 'asst_dJsubuap9rUwzItODnKpkQkb';
      console.log("assistant id is:", dbqueryAssistantId);

      console.log(
        "\nHello there, I'm your database expert. Ask some complicated queries.\n"
      );

      const thread = await this.openai.beta.threads.create();
      const threadId = thread.id;
      console.log("the thread id is:", threadId);

      // let keepAsking = true;

     // while (keepAsking) {
        //remove
        // const userQuestion = await this.askQuestion(
        //   "\nWhat is your question? "
        // );
        await this.openai.beta.threads.messages.create(threadId, {
          role: "user",
          content: userQuestion+"instructions: you must generate SQL's to answer questions with sql schema mention in fileId: file-fGxWXrAKGdIkCHnwnTvR2ZWE",
        });

        const run = await this.openai.beta.threads.runs.create(threadId, {
          assistant_id: dbqueryAssistantId,
        });

        let runStatus = await this.openai.beta.threads.runs.retrieve(
          threadId,
          run.id
        );

        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await this.openai.beta.threads.runs.retrieve(
            threadId,
            run.id
          );
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
        return JSON.stringify(lastMessageForRun.content);
        // const continueAsking = await this.askQuestion(
        //   "Do you want to ask another question? (yes/no) "
        // );
        // keepAsking = continueAsking.toLowerCase() === "yes";

        // if (!keepAsking) {
        //   console.log("Alrighty then, I hope you learned something!\n");
        // }
     // }

      // this.readline.close();
    } catch (error) {
      console.error("Error calling ChatCompletion API:", error);
      throw error;
    }
  }
}
