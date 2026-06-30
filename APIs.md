# Integraciones de Terceros

## Proyecto: Tu Selva Urbana
## Equipo: dev-anfibios
## Fecha: 29 de junio de 2026

---

## 1. Servicio Principal: Google Gemini AI — Chatbot Botánico

### 1.1 ¿Qué API se utiliza?

| Campo | Detalle |
|---|---|
| **Proveedor** | Google (DeepMind) |
| **Servicio** | Google Generative AI — Gemini |
| **Modelo utilizado** | `gemini-2.5-flash` |
| **Paquete npm (backend)** | `@google/generative-ai` v0.24.1 |
| **Tipo de API** | REST API con SDK oficial de Google |
| **Autenticación** | API Key (`GEMINI_API_KEY`) almacenada en `.env` |
| **Costo** | Gratuito (tier free de Google AI Studio) |
| **Documentación oficial** | https://ai.google.dev/gemini-api/docs |

### 1.2 ¿Para qué se utiliza?

Google Gemini funciona como el **cerebro del chatbot botánico** de Tu Selva Urbana. Su propósito es:

- **Asistir a los usuarios** con dudas sobre cuidado de plantas (riego, luz, humedad, plagas).
- **Guiar en la navegación** de la plataforma (cómo comprar, cómo usar el quiz, dónde ver pedidos).
- **Recomendar plantas** según las necesidades del usuario.
- **Proporcionar información botánica** sobre especies específicas del catálogo.
- **Personalizar respuestas** tomando en cuenta el contexto (si el usuario está viendo una planta en particular).

El chatbot está disponible como un **botón flotante** en toda la aplicación, accesible en cualquier momento sin interrumpir la navegación del usuario.

**¿Por qué se eligió este servicio?**

Se eligió Google Gemini porque ofrece un modelo de lenguaje avanzado (`gemini-2.5-flash`) con respuestas rápidas y de alta calidad, su SDK oficial para Node.js facilita la integración con el backend Express, cuenta con un tier gratuito generoso para desarrollo y producción inicial, y permite personalizar completamente las respuestas mediante system prompts detallados.

### 1.3 ¿Cómo se utiliza? — Implementación Técnica

#### Configuración

La API Key de Gemini se almacena como variable de entorno en el backend:

```env
# Archivo: tu-selva-urbana-backend/.env
GEMINI_API_KEY="AIzaSy*****************************"
```

Dependencia instalada en el `package.json` del backend:

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1"
  }
}
```

Registro de la ruta en `src/server.js` (línea 25):

```javascript
app.use('/api/chat', require('./routes/chat.routes'));
```

Definición de la ruta en `src/routes/chat.routes.js`:

```javascript
const router = require('express').Router();
const ctrl = require('../controllers/chat.controller');

router.post('/', ctrl.sendMessage);

module.exports = router;
```

Esto expone el endpoint **`POST /api/chat`** que recibe el mensaje del usuario y devuelve la respuesta de Gemini.

#### Controlador del Chat — Backend

El archivo principal de la integración es `src/controllers/chat.controller.js`.

**Importación del SDK:**

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
```

**System Prompt (Personalidad del Chatbot):**

El chatbot tiene un prompt de sistema de **65 líneas** que define su personalidad, conocimiento de la plataforma y reglas de respuesta. Este prompt se envía junto con cada mensaje del usuario para contextualizar a Gemini:

```javascript
const SYSTEM_PROMPT = `
Eres el asistente virtual oficial de "Tu Selva Urbana", una tienda en línea 
especializada en plantas de interior y arquitectura biofílica.

=== INFORMACIÓN DE LA PLATAFORMA ===

1. CATÁLOGO Y COMPRA:
   - La tienda vende plantas de interior como Monstera, Pothos, Ficus, 
     Sansevieria, Calathea, Alocasia, Helecho Boston, y más.
   - Para comprar: Ve al "Catálogo Botánico" desde el menú lateral.
   - Cada planta tiene dos botones: "Carrito" y "Adoptar" (compra directa).

2. CARRITO DE COMPRAS:
   - Haz clic en "Mi Carrito" para ver tus plantas seleccionadas.
   - El envío es GRATIS en todos los pedidos.

3. PROCESO DE PAGO:
   - Paso 1: Dirección de entrega.
   - Paso 2: Método de pago (Tarjeta o PayPal).
   - Paso 3: Confirmación con animación de confetti.

4. MIS PEDIDOS:
   - En "Mi Cuenta" > "Mis Pedidos" se ve el historial de compras.

5. QUIZ DE DIAGNÓSTICO IA:
   - Accede desde "Recomendaciones" en el menú.
   - El quiz recomienda plantas según tu espacio y estilo de vida.

6. FEED SOCIAL:
   - Publica fotos de tus plantas, da likes y comenta.

7. MI CUENTA Y PERFIL:
   - Edita nombre, foto de perfil y datos personales.

8. SEGURIDAD Y REGISTRO:
   - Verificación por código OTP enviado al correo electrónico.
   - Opción de recuperar contraseña desde el login.

9. SCANNER IA:
   - Identifica plantas a partir de una foto con la cámara.

=== REGLAS DE RESPUESTA ===
1. Responde de forma AMIGABLE, CONCISA y ENTUSIASTA (máximo 4 oraciones).
2. Usa emojis relacionados con plantas 🌿🌱🍃 de forma moderada.
3. Si preguntan sobre cuidados de plantas, responde con información botánica.
4. Si preguntan algo fuera del tema, declina con amabilidad y redirige.
5. NUNCA inventes precios o inventario que no sepas con certeza.
6. Si el usuario parece frustrado, muestra empatía primero.
`;
```

**Función del controlador (`sendMessage`):**

```javascript
// POST /api/chat
exports.sendMessage = async (req, res) => {
    try {
        const { message, context } = req.body;

        // 1. Validación del mensaje
        if (!message) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        // 2. Verificación de la API Key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'GEMINI_API_KEY no está configurada en el servidor.' 
            });
        }

        // 3. Inicialización del cliente Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // 4. Construcción del prompt con contexto opcional
        const userQuery = context
            ? `${message}\n\n[Contexto: el usuario está viendo la planta "${context}"]`
            : message;

        const prompt = `${SYSTEM_PROMPT}\n\nPregunta del usuario: "${userQuery}"`;

        // 5. Llamada a la API de Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 6. Respuesta al frontend
        res.json({ reply: responseText });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.status(500).json({ 
            error: 'Error procesando la respuesta del asistente botánico.' 
        });
    }
};
```

**Desglose del flujo de datos:**

| Paso | Acción | Detalle |
|------|--------|---------|
| 1 | Validación | Se verifica que el campo `message` no esté vacío |
| 2 | Verificación de API Key | Se comprueba que `GEMINI_API_KEY` exista en las variables de entorno |
| 3 | Inicialización de Gemini | Se crea una instancia de `GoogleGenerativeAI` y se selecciona el modelo `gemini-2.5-flash` |
| 4 | Construcción del prompt | Se concatena el system prompt + el mensaje del usuario. Si hay `context` (nombre de planta que el usuario está viendo), se agrega como metadata |
| 5 | Llamada a la API | Se invoca `model.generateContent(prompt)` que envía la solicitud a los servidores de Google |
| 6 | Respuesta | Se extrae el texto con `result.response.text()` y se devuelve como JSON `{ reply: "..." }` |

#### Implementación del Frontend — Componente Chatbot

El chatbot en el frontend se encuentra en `src/components/Chatbot.jsx`.

**Capa de servicios** (`src/services/api.js`, líneas 123-127):

```javascript
export const chatAPI = {
    sendMessage: (message, context) =>
        request('/chat', { method: 'POST', body: JSON.stringify({ message, context }) })
};
```

**Componente React:**

```javascript
// src/components/Chatbot.jsx
import { chatAPI } from '../services/api';

export default function Chatbot({ plantContext = null }) {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', 
          text: '¡Hola! Soy tu asistente botánico de Tu Selva Urbana 🌿. ¿En qué te puedo ayudar hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Llamada al backend → Gemini
            const res = await chatAPI.sendMessage(userMsg.text, plantContext);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, sender: 'bot', text: res.reply 
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, sender: 'bot', 
                text: 'Ups, mi conexión mental a la naturaleza falló. ¿Puedes repetirlo?' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
}
```

**Características de la interfaz:**
- Botón flotante arrastrable con `framer-motion` (`drag`)
- Animaciones de entrada/salida del panel de chat
- Indicador de carga con puntos animados (typing indicator)
- Scroll automático al último mensaje
- Diferenciación visual entre mensajes de usuario (verde) y bot (blanco)
- El prop `plantContext` permite enviar contexto al chatbot (ej: nombre de la planta que el usuario está viendo)

### 1.4 Flujo del Dato — Diagrama de Secuencia

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend React - Chatbot.jsx
    participant S as Servicio API - api.js
    participant B as Backend Express - chat.controller.js
    participant G as Google Gemini API - gemini-2.5-flash

    U->>F: Escribe mensaje en el chat
    F->>F: Agrega mensaje a la UI
    F->>F: Muestra indicador de carga
    F->>S: chatAPI.sendMessage
    S->>B: POST /api/chat
    B->>B: Valida mensaje y API Key
    B->>B: Construye prompt con SYSTEM_PROMPT
    B->>G: model.generateContent
    G-->>B: result.response.text
    B-->>S: reply - respuesta de Gemini
    S-->>F: Respuesta JSON
    F->>F: Agrega respuesta del bot a la UI
    F->>F: Oculta indicador de carga
    F-->>U: Muestra respuesta del asistente
```

### 1.5 Diagrama de Arquitectura — Visión General

```mermaid
graph TB
    subgraph Frontend
        A["Chatbot.jsx - Componente flotante"]
        B["api.js - chatAPI.sendMessage"]
    end

    subgraph Backend
        C["chat.routes.js - POST /api/chat"]
        D["chat.controller.js - sendMessage"]
        E["System Prompt - 65 lineas de contexto"]
    end

    subgraph Google_Cloud
        F["Google Generative AI - Gemini 2.5 Flash"]
    end

    subgraph Configuracion
        G[".env - GEMINI_API_KEY"]
        H["package.json - generative-ai v0.24.1"]
    end

    A -->|input del usuario| B
    B -->|POST /api/chat| C
    C --> D
    D -->|Concatena| E
    E -->|prompt completo| F
    F -->|respuesta generada| D
    D -->|reply| B
    B -->|respuesta| A

    G -.->|apiKey| D
    H -.->|SDK| D
```

### 1.6 Archivos Involucrados — Resumen

| Archivo | Ruta | Responsabilidad |
|---|---|---|
| `chat.controller.js` | `backend/src/controllers/chat.controller.js` | Controlador principal: system prompt, inicialización de Gemini, procesamiento de mensajes |
| `chat.routes.js` | `backend/src/routes/chat.routes.js` | Definición de la ruta `POST /api/chat` |
| `server.js` | `backend/src/server.js` | Registro del endpoint `/api/chat` en Express (línea 25) |
| `.env` | `backend/.env` | Almacena `GEMINI_API_KEY` (no se sube al repositorio) |
| `package.json` | `backend/package.json` | Dependencia `@google/generative-ai` v0.24.1 |
| `test_gemini.js` | `backend/test_gemini.js` | Script de prueba para validar conexión con Gemini |
| `api.js` | `frontend/src/services/api.js` | Capa de servicio del frontend — `chatAPI.sendMessage()` |
| `Chatbot.jsx` | `frontend/src/components/Chatbot.jsx` | Componente de interfaz del chatbot en React |

### 1.7 Evidencia de Consumo — Request y Response

**Request (Petición del frontend al backend):**
```http
POST /api/chat HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...

{
    "message": "¿Cada cuánto debo regar mi Monstera?",
    "context": "Monstera Deliciosa"
}
```

**Prompt construido y enviado a Gemini:**
```
[SYSTEM_PROMPT completo de 65 líneas con información de la plataforma y reglas]

Pregunta del usuario: "¿Cada cuánto debo regar mi Monstera?

[Contexto: el usuario está viendo la planta "Monstera Deliciosa"]"
```

**Response (Respuesta de Gemini devuelta al frontend):**
```json
{
    "reply": "¡Gran pregunta sobre tu Monstera! 🌿 Lo ideal es regarla cada 7-10 días, dejando que el sustrato se seque entre riegos. Mete un dedo en la tierra: si los primeros 3cm están secos, es momento de regar. En invierno, puedes espaciarlo a cada 2 semanas 💧"
}
```

---

## 2. Otros Servicios de Terceros Consumidos

Además de Google Gemini, el proyecto utiliza los siguientes servicios externos de forma complementaria:

| # | Servicio | Propósito | Tipo | Autenticación |
|---|---|---|---|---|
| 1 | **PayPal Checkout SDK** | Pasarela de pagos real para compra de plantas en MXN. El usuario puede pagar con su cuenta PayPal o tarjeta. | SDK JavaScript | Client ID (Sandbox) |
| 2 | **Brevo (ex Sendinblue) SMTP** | Envío de correos electrónicos transaccionales: códigos OTP de verificación de cuenta y enlaces de restablecimiento de contraseña. | SMTP | Usuario + SMTP Key |
| 3 | **UI Avatars** | Generación dinámica de avatares con las iniciales del usuario cuando no tiene foto de perfil configurada. | REST (pública) | No requiere |
| 4 | **Unsplash Images** | Imágenes de alta calidad de plantas para el feed social y el escáner. | Hot-linking CDN | No requiere |
| 5 | **Pravatar** | Avatares aleatorios realistas para usuarios simulados en datos de prueba. | REST (pública) | No requiere |
| 6 | **Google Model Viewer / Three.js CDN** | Hosting de modelos 3D en formato `.glb` para visualización interactiva de plantas. | CDN público | No requiere |
| 7 | **Via Placeholder** | Imágenes placeholder como fallback cuando una planta no tiene imagen. | REST (pública) | No requiere |

---

## 3. Resumen Visual de Todas las Integraciones

```mermaid
graph LR
    subgraph Tu_Selva_Urbana
        APP["Aplicacion Web - React + Express"]
    end

    APP -->|IA Chatbot| GEMINI["Google Gemini 2.5 Flash"]
    APP -->|Pagos| PAYPAL["PayPal SDK"]
    APP -->|Emails OTP| BREVO["Brevo SMTP"]
    APP -->|Avatares| UIAV["UI Avatars"]
    APP -->|Fotos HD| UNSPLASH["Unsplash"]
    APP -->|Avatares mock| PRAVATAR["Pravatar"]
    APP -->|Modelos 3D| MODELS["Model Viewer CDN"]
    APP -->|Fallback imgs| PLACEHOLDER["Via Placeholder"]

    style GEMINI fill:#4285F4,stroke:#1a73e8,color:#fff,stroke-width:3px
    style PAYPAL fill:#003087,stroke:#002060,color:#fff
    style BREVO fill:#0B996E,stroke:#087f5b,color:#fff
```

---

## Checklist de Éxito

- [x] **Claridad al explicar el "por qué" y el "cómo" de la API** — Se documenta por qué se eligió Gemini y cómo se integra en frontend y backend.
- [x] **Documentación limpia y bien formateada en Markdown dentro del repositorio** — Tablas, bloques de código, diagramas Mermaid.
- [x] **Evidencia real de consumo** — Se incluyen ejemplos de request/response y el código completo del controlador.

---

**Elaborado por:** Equipo dev-anfibios · Cesar Enrique Garay Garcia · Zahir Andres Rodriguez Mora
**Fecha de elaboración:** 29 de junio de 2026
