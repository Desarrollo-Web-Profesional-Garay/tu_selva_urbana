const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'c:/Users/cesar/Downloads/tu-selva-urbana-backend/.env' });

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Key length:", apiKey ? apiKey.length : 0);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("Hola");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("1.5-flash Error:", e.status, e.message);
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const res2 = await model2.generateContent("Hola");
            console.log("Success with pro:", res2.response.text());
        } catch(e2) {
            console.error("gemini-pro Error:", e2.status, e2.message);
        }
    }
}
test();
