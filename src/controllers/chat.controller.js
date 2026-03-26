const { GoogleGenerativeAI } = require('@google/generative-ai');

// POST /api/chat
exports.sendMessage = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el .env del servidor.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
Eres un experto botánico asistiendo en la tienda en línea "Tu Selva Urbana".
El usuario pregunta esto: "${message}"

${context ? `Contexto actual del usuario: Está mirando la planta llamada "${context}".` : ''}

Reglas estrictas:
1. Responde de manera MUY concisa y amigable (máximo 3 oraciones).
2. Usa viñetas breves si hay pasos de cuidado.
3. Si la pregunta NO es sobre plantas o botánica, declina educadamente y di que solo sabes de plantas.
4. Eres un asistente, no un catálogo completo, mantente breve.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.status(500).json({ error: 'Error procesando la respuesta del asistente botánico.' });
    }
};
