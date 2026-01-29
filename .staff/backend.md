# FeliNode Backend

package handler

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/paquito-svg/feliNode-back/pkg/middleware"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/genai"
)

// RequestData define la estructura del JSON que recibirás
type RequestData struct {
	Text  string `json:"text"`  // El texto que antes iba en el header
	Audio string `json:"audio"` // El audio en formato Base64
}

type PronunciationAssessmentParams struct {
	ReferenceText           string `json:"ReferenceText"`
	GradingSystem           string `json:"GradingSystem"`
	Granularity             string `json:"Granularity"`
	EnableMiscue            bool   `json:"EnableMiscue"`
	EnableProsodyAssessment bool   `json:"EnableProsodyAssessment"`
}

type CombinedResponse struct {
	AzureAnalysis  json.RawMessage `json:"azure_analysis"`
	GeminiFeedback string          `json:"gemini_feedback"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	middleware.Authenticated(handleRequest)(w, r)
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	// 1. Decodificar el Body de la solicitud
	var data RequestData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "invalid json body", http.StatusBadRequest)
		return
	}

	if data.Text == "" || data.Audio == "" {
		http.Error(w, "missing text or audio param in body", http.StatusBadRequest)
		return
	}

	// 2. Decodificar el audio de Base64 a bytes
	audioBytes, err := base64.StdEncoding.DecodeString(data.Audio)
	if err != nil {
		http.Error(w, "invalid audio encoding", http.StatusBadRequest)
		return
	}

	var wg sync.WaitGroup
	var azureResp []byte
	var geminiResp string
	var azureErr, geminiErr error

	wg.Add(2)

	// ---------------------------
	// Tarea 1: Azure Speech API
	// ---------------------------
	go func() {
		defer wg.Done()
		region, key := os.Getenv("AZURE_SPEECH_REGION"), os.Getenv("AZURE_SPEECH_KEY")
		url := fmt.Sprintf("https://%s.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US", region)

		req, err := http.NewRequest("POST", url, bytes.NewBuffer(audioBytes))
		if err != nil {
			azureErr = err
			return
		}
		req.Header.Set("Ocp-Apim-Subscription-Key", key)
		req.Header.Set("Content-Type", "audio/wav; codecs=audio/pcm; samplerate=16000")
		req.Header.Set("Accept", "application/json")

		// Configurar parámetros de evaluación
		params := PronunciationAssessmentParams{
			ReferenceText: data.Text,
			GradingSystem: "HundredMark",
			Granularity:   "Phoneme",
			EnableMiscue:  true,
		}
		paramsJSON, _ := json.Marshal(params)
		encodedParams := base64.StdEncoding.EncodeToString(paramsJSON)
		req.Header.Set("Pronunciation-Assessment", encodedParams)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			azureErr = err
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			azureErr = fmt.Errorf("azure api returned status: %d", resp.StatusCode)
			return
		}

		azureResp, err = io.ReadAll(resp.Body)
		if err != nil {
			azureErr = err
		}
	}()

	// ---------------------------
	// Tarea 2: Gemini / Vertex AI
	// ---------------------------
	go func() {
		defer wg.Done()
		ctx := context.Background()

		// 1. Carga de credenciales desde la variable de entorno de Vercel
		credsJSONStr := os.Getenv("G_JSON_CREDS")
		if credsJSONStr == "" {
			geminiErr = fmt.Errorf("G_JSON_CREDS is not set in environment")
			return
		}

		// Intentar decodificar si está en Base64 (común en Vercel)
		// Si falla, asumimos que es JSON directo.
		var credsBytes []byte
		if decoded, err := base64.StdEncoding.DecodeString(credsJSONStr); err == nil {
			credsBytes = decoded
		} else {
			credsBytes = []byte(credsJSONStr)
		}

		// 2. Inicialización del cliente
		creds, err := google.CredentialsFromJSON(ctx, credsBytes, "https://www.googleapis.com/auth/cloud-platform")
		if err != nil {
			geminiErr = fmt.Errorf("failed to parse credentials: %w", err)
			return
		}

		client, err := genai.NewClient(ctx, &genai.ClientConfig{
			Backend:    genai.BackendVertexAI,
			Project:    "ecstatic-baton-485614-q9", // Mantenemos tu ID
			Location:   "us-central1",              // Mantenemos tu región
			HTTPClient: oauth2.NewClient(ctx, creds.TokenSource),
		})
		if err != nil {
			geminiErr = fmt.Errorf("failed to create genai client: %w", err)
			return
		}

		// 3. Configuración del contenido Multimodal
		modelName := "gemini-2.5-flash"

		promptPart := &genai.Part{
			Text: "Corrige la pronunciación de este audio, responde en español solo con las correcciones. Texto esperado: " + data.Text,
		}

		audioPart := &genai.Part{
			InlineData: &genai.Blob{
				MIMEType: "audio/wav",
				Data:     audioBytes,
			},
		}

		content := &genai.Content{
			Role:  "user",
			Parts: []*genai.Part{promptPart, audioPart},
		}

		// 4. Llamada al modelo
		// GenerateContent espera un slice de Content: []*genai.Content
		resp, err := client.Models.GenerateContent(ctx, modelName, []*genai.Content{content}, nil)
		if err != nil {
			geminiErr = fmt.Errorf("gemini analysis error: %w", err)
			return
		}

		// 5. Extracción de la respuesta
		if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
			geminiResp = resp.Candidates[0].Content.Parts[0].Text
		}
	}()

	wg.Wait()

	// Manejo de errores parciales o totales
	if azureErr != nil {
		log.Printf("Azure error: %v", azureErr)
		http.Error(w, "Error processing audio with Azure", http.StatusInternalServerError)
		return
	}
	// Si Gemini falla, podríamos devolver solo Azure o error.
	// Decisión: Loguear error de Gemini pero devolver respuesta de Azure, con feedback vacío o mensaje de error.
	if geminiErr != nil {
		log.Printf("Gemini error (non-fatal for main flow, but included in response): %v", geminiErr)
		geminiResp = fmt.Sprintf("Error getting AI feedback: %v", geminiErr)
	}

	// 5. Combinar y enviar respuesta
	combined := CombinedResponse{
		AzureAnalysis:  json.RawMessage(azureResp),
		GeminiFeedback: geminiResp,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(combined); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}
