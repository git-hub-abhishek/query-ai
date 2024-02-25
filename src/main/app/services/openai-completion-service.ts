import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';
import { ChatCompletion } from "openai/resources";


export class OpenAICompletionService {
  private openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  private schema_path = path.join(__dirname, process.env.DB_SCHEMA_LOCATION) || path.join(__dirname, '../../../assets/resources/tx_db_schema.sql');

  constructor() {
    console.log("openaiCompletionService constructor");
  }

  public async queryWithCompletion(userQuestion: string): Promise<string> {
    try {
      //read tx_db_schema.sql file and create a file from assets/resources folder
      // the create a prompt for open ai completion
      // call open ai completion
      // return the result
      //const schema = "/path/to/tx_db_schema.sql";
      var dbSqlSchema: string = fs.readFileSync(this.schema_path, "utf-8");
      dbSqlSchema = dbSqlSchema.replace(/(\r\n|\n|\r)/gm, "");
      var prompt = `prompt: You are an expert DBA, write a SINGLE SQL query to do ${userQuestion}. 
      Your answer must consider the db_lookup_schema:${dbSqlSchema}.
      Always prefer JOINs over inner queries.Response-format {SQL:<resultant_sql>}.
      Instruction: You must respond with {"SQL": "I DONT KNOW"} if you are not sure about the answer.
      Instruction: You must consider the Enum defined in the db_lookup_schema.
      Instruction: Your answer MUST MUST MUST have at least one table defined in the db_lookup_schema. else respond with {"SQL": "I DONT KNOW"}.`;

      // prompt = `You are an expert answting questions to kids. Must answer in maximum 100 words. Question:${userQuestion}.Format result:{Answer:<your_answer>}`
      const completion: ChatCompletion = await this.openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0,
        seed: 7739
      });

      const choices: ChatCompletion.Choice[] = completion.choices;
      const firsChoice = choices[0];
      console.log("first choice is:", firsChoice);

      const result = JSON.stringify(completion, null, 2)
      //console.log("result is:",firsChoice);
      console.log(firsChoice.message.content);
      //console.log(JSON.parse(firsChoice.message.content).SQL);
      console.log(JSON.parse(firsChoice.message.content));
      return JSON.stringify(JSON.parse(firsChoice.message.content).SQL);
    } catch (error) {
      console.error("Error calling ChatCompletion API:", error);
      throw error;
    }
  }
}
