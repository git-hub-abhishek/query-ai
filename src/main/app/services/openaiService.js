const { Configuration, OpenAIApi } = require("openai");

// Initialize the OpenAI API client with your API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is securely stored
});
const openai = new OpenAIApi(configuration);

// Function to call the ChatCompletion API
async function callChatCompletion(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Specify the model you want to use
      messages: [{
        role: "user",
        content: prompt,
      }],
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling ChatCompletion API:", error);
    throw error;
  }
}

// Example usage
const prompt = "What is the capital of France?";
callChatCompletion(prompt)
  .then((response) => console.log("ChatCompletion response:", response))
  .catch((error) => console.error(error));
