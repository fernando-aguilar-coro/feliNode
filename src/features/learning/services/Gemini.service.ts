import { supabase } from '../../../api/supabaseClient';
import { API_BASE_URL } from '../../../config';
import { useUserStore } from '../../../store/UserStore';

export const GeminiService = {
    /**
     * Sends a text prompt to Gemini and returns the response.
     * @param prompt The text prompt to send.
     * @returns The generated response from Gemini.
     */
    generateResponse: async (prompt: string, options?: { raw?: boolean }): Promise<string> => {
        try {
            const { isGuest } = useUserStore.getState();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token && !isGuest) {
                throw new Error("No estás autenticado.");
            }

            const headers: any = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/gemini_query`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ text: prompt }),
            });

            if (!response.ok) {
                throw new Error("Error al consultar a Gemini");
            }

            const data = await response.json();

            if (options?.raw) {
                return data.response || "";
            }

            // Clean up quotes if present (standard cleanup for this app)
            return data.response ? data.response.replace(/["']/g, "").trim() : "";

        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }
};
