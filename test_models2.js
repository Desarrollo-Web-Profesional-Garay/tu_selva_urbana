const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-pro'
    ];
    
    for (const m of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hola");
            console.log(`¡EXITO CON! ${m}:`, result.response.text());
            return;
        } catch(err) {
            console.log(`Fallo ${m}:`, err.status, err.message);
        }
    }
}
test();
