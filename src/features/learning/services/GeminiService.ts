import { supabase } from '../../../api/supabaseClient';
import { API_BASE_URL } from '../../../config';

export const GeminiService = {
    /**
     * Sends a text prompt to Gemini and returns the response.
     * @param prompt The text prompt to send.
     * @returns The generated response from Gemini.
     */
    generateResponse: async (prompt: string): Promise<string> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error("No estás autenticado.");
            }

            const response = await fetch(`${API_BASE_URL}/gemini_query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ text: prompt }),
            });

            if (!response.ok) {
                throw new Error("Error al consultar a Gemini");
            }

            const data = await response.json();
            // Clean up quotes if present (standard cleanup for this app)
            return data.response ? data.response.replace(/["']/g, "").trim() : "";

        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }
};
