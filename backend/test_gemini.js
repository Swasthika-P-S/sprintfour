const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

async function test() {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  
  for (const modelName of models) {
    try {
      console.log(`\nTrying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, who are you? Respond in 5 words.");
      console.log(`Success! Response: "${result.response.text().trim()}"`);
      break; // stop on first success
    } catch (err) {
      console.error(`Failed ${modelName}:`, err.message);
    }
  }
}

test();
