# FeliNode Backend

FeliNode Backend is a serverless Go application built for Vercel, designed to power the "FeliNode" English learning app. It handles authentication, data synchronization, and AI-powered learning features using Azure services and Google Gemini.

## 🏗 Architecture

- **Runtime**: Go 1.x (Vercel Serverless Functions)
- **Auth**: Supabase Auth (JWT)
- **AI Services**:
  - **Azure Speech**: For quantitative pronunciation metrics (accuracy, fluency).
  - **Google Gemini (Vertex AI)**: For qualitative, natural language feedback and general queries.

## 🚀 Key Features

### Pronunciation Assessment (`/api/pronunciation_assessment`)

This endpoint orchestrates a multimodal analysis of user speech. It concurrently calls **Azure Speech Service** for scoring and **Gemini** for conversational feedback, streaming results back to the client via **Server-Sent Events (SSE)**.

- **URL**: `/api/pronunciation_assessment`
- **Method**: `POST`
- **Authentication**: Required (`Authorization: Bearer <SUPABASE_JWT>`)
- **Body**: `{"text": "...", "audio": "base64..."}`

---

### Gemini Query (`/api/gemini_query`) [NEW]

A general-purpose endpoint to interact with Gemini using only text. This is useful for chat features, explanations, or any text-based AI assistance within the app.

- **URL**: `/api/gemini_query`
- **Method**: `POST`
- **Authentication**: Required (`Authorization: Bearer <SUPABASE_JWT>`)
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
  "text": "Explain the difference between 'make' and 'do' in English."
}
```

#### **Response Body**
```json
{
  "response": "Here is the explanation..."
}
```

#### **React Native Example**

```typescript
import { supabase } from './supabaseConfig';

const queryGemini = async (queryText: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) throw new Error("No authentication token found");

    const response = await fetch('https://your-api.vercel.app/api/gemini_query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: queryText }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini says:', data.response);
    return data.response;
  } catch (error) {
    console.error('Failed to query Gemini:', error);
  }
};
```

---

