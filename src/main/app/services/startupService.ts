import OpenAI from "openai";

export class startupService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  dbqueryAssistant = "qauery-AI_DB-admin"
  
}
