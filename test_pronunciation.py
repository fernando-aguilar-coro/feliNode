"""
Script para testear Pronunciation Assessment de Azure Speech Services
Uso:
    python test_pronunciation.py <path_to_wav_file> "<reference_text>"
    
Ejemplo:
    python test_pronunciation.py audio.wav "hello world"
"""

import sys
import base64
import requests
import json

def test_pronunciation_backend(wav_path: str, reference_text: str):
    """
    Prueba el endpoint del backend que envuelve Azure Speech Services
    """
    print("=" * 60)
    print("TESTANDO CON BACKEND (feli-node-back.vercel.app)")
    print("=" * 60)
    
    # Leer el archivo WAV
    try:
        with open(wav_path, 'rb') as audio_file:
            audio_data = audio_file.read()
            base64_audio = base64.b64encode(audio_data).decode('utf-8')
        print(f"✓ Archivo leído: {wav_path}")
        print(f"  Tamaño: {len(audio_data)} bytes")
        print(f"  Base64 length: {len(base64_audio)} caracteres")
    except Exception as e:
        print(f"✗ Error leyendo archivo: {e}")
        return
    
    # Preparar request
    url = "https://feli-node-back.vercel.app/api/pronunciation_assessment"
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        'text': reference_text,
        'audio': base64_audio
    }
    
    print(f"\n✓ Enviando request a: {url}")
    print(f"  Reference text: '{reference_text}'")
    
    # Enviar request
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"\n✓ Response Status: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print("\n" + "=" * 60)
            print("RESPUESTA EXITOSA")
            print("=" * 60)
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Parse results si disponibles
            if data.get('RecognitionStatus') == 'Success' and data.get('NBest'):
                best = data['NBest'][0]
                print("\n" + "=" * 60)
                print("ANÁLISIS DE RESULTADOS")
                print("=" * 60)
                print(f"Overall Score: {best.get('AccuracyScore', 'N/A')}")
                print(f"Pronunciation Score: {best.get('PronunciationScore', 'N/A')}")
                print(f"Fluency Score: {best.get('FluencyScore', 'N/A')}")
                print(f"Completeness Score: {best.get('CompletenessScore', 'N/A')}")
                
                if best.get('Words'):
                    print(f"\nPalabras detectadas: {len(best['Words'])}")
                    for word in best['Words']:
                        print(f"  - {word['Word']}: {word.get('AccuracyScore', 'N/A')} (Error: {word.get('ErrorType', 'None')})")
            else:
                print(f"\n⚠ Recognition Status: {data.get('RecognitionStatus', 'Unknown')}")
        else:
            print(f"\n✗ Error del servidor:")
            print(f"  Status: {response.status_code}")
            print(f"  Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("\n✗ Timeout: El servidor tardó más de 30 segundos en responder")
    except Exception as e:
        print(f"\n✗ Error en request: {e}")


def test_pronunciation_direct_azure(wav_path: str, reference_text: str, 
                                    azure_key: str = None, 
                                    azure_region: str = "eastus"):
    """
    Prueba directamente con Azure Speech Services (opcional, requiere API key)
    """
    if not azure_key:
        print("\n" + "=" * 60)
        print("PRUEBA DIRECTA CON AZURE (OMITIDA - NO HAY API KEY)")
        print("=" * 60)
        print("Para probar directamente con Azure, ejecuta:")
        print("  test_pronunciation_direct_azure('audio.wav', 'text', 'YOUR_AZURE_KEY')")
        return
    
    print("\n" + "=" * 60)
    print("TESTANDO DIRECTAMENTE CON AZURE SPEECH SERVICES")
    print("=" * 60)
    
    # Leer el archivo WAV
    try:
        with open(wav_path, 'rb') as audio_file:
            audio_data = audio_file.read()
        print(f"✓ Archivo leído: {wav_path}")
        print(f"  Tamaño: {len(audio_data)} bytes")
    except Exception as e:
        print(f"✗ Error leyendo archivo: {e}")
        return
    
    # URL de Azure Speech Services
    url = f"https://{azure_region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"
    
    # Headers
    headers = {
        'Ocp-Apim-Subscription-Key': azure_key,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Accept': 'application/json'
    }
    
    # Parámetros de pronunciation assessment
    params = {
        'language': 'en-US',
        'format': 'detailed'
    }
    
    # Pronunciation assessment params en header
    pronunciation_params = {
        'referenceText': reference_text,
        'gradingSystem': 'HundredMark',
        'granularity': 'Phoneme',
        'dimension': 'Comprehensive'
    }
    headers['Pronunciation-Assessment'] = json.dumps(pronunciation_params)
    
    print(f"\n✓ Enviando request a Azure ({azure_region})")
    print(f"  Reference text: '{reference_text}'")
    
    # Enviar request
    try:
        response = requests.post(url, headers=headers, params=params, data=audio_data, timeout=30)
        print(f"\n✓ Response Status: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print("\n" + "=" * 60)
            print("RESPUESTA DIRECTA DE AZURE")
            print("=" * 60)
            print(json.dumps(data, indent=2, ensure_ascii=False))
        else:
            print(f"\n✗ Error de Azure:")
            print(f"  Status: {response.status_code}")
            print(f"  Response: {response.text}")
            
    except Exception as e:
        print(f"\n✗ Error en request: {e}")


def analyze_wav_file(wav_path: str):
    """
    Analiza las propiedades del archivo WAV
    """
    print("\n" + "=" * 60)
    print("ANÁLISIS DEL ARCHIVO WAV")
    print("=" * 60)
    
    try:
        import wave
        with wave.open(wav_path, 'rb') as wav:
            channels = wav.getnchannels()
            sample_width = wav.getsampwidth()
            framerate = wav.getframerate()
            n_frames = wav.getnframes()
            duration = n_frames / float(framerate)
            
            print(f"✓ Archivo WAV válido")
            print(f"  Canales: {channels} ({'mono' if channels == 1 else 'stereo'})")
            print(f"  Sample width: {sample_width} bytes ({sample_width * 8} bits)")
            print(f"  Sample rate: {framerate} Hz")
            print(f"  Frames: {n_frames}")
            print(f"  Duración: {duration:.2f} segundos")
            
            # Verificar si cumple con los requisitos de Azure
            print("\n  Requisitos de Azure Speech:")
            print(f"    {'✓' if channels == 1 else '✗'} Mono (1 canal) - Actual: {channels}")
            print(f"    {'✓' if sample_width == 2 else '✗'} 16-bit PCM - Actual: {sample_width * 8}-bit")
            print(f"    {'✓' if framerate == 16000 else '✗'} 16kHz - Actual: {framerate} Hz")
            
    except ImportError:
        print("⚠ Módulo 'wave' no disponible, análisis omitido")
    except Exception as e:
        print(f"✗ Error analizando WAV: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python test_pronunciation.py <path_to_wav_file> \"<reference_text>\"")
        print("\nEjemplo:")
        print("  python test_pronunciation.py recording.wav \"hello world\"")
        sys.exit(1)
    
    wav_path = sys.argv[1]
    reference_text = sys.argv[2]
    
    print("\n" + "=" * 60)
    print("AZURE PRONUNCIATION ASSESSMENT TESTER")
    print("=" * 60)
    print(f"Archivo: {wav_path}")
    print(f"Texto de referencia: '{reference_text}'")
    
    # Analizar el archivo WAV
    analyze_wav_file(wav_path)
    
    # Probar con el backend
    test_pronunciation_backend(wav_path, reference_text)
    
    # Opcional: descomentar para probar directamente con Azure
    # test_pronunciation_direct_azure(wav_path, reference_text, azure_key="YOUR_KEY_HERE")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETADO")
    print("=" * 60)
