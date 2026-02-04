# Plan: Implementación de Efectos de Sonido (SFX) para UX

Este documento detalla la estrategia para integrar efectos de sonido en la aplicación FeliNode, con el objetivo de enriquecer la experiencia de usuario (UX) mediante retroalimentación auditiva.

> [!NOTE]
> Clarificación: El usuario mencionó "fbx". FBX es un formato para modelos 3D. Para efectos de sonido, utilizaremos formatos de audio estándar compatibles con `expo-av` como **MP3** o **WAV**.

## 1. Objetivo
Aumentar la inmersión y proporcionar feedback inmediato a las acciones del usuario, haciendo que la aplicación se sienta más "viva" y receptiva.

## 2. Tecnologías
- **Librería Principal**: `expo-av` (Ya instalada en el `package.json`).
- **Gestión de Estado**: Context API (`SoundContext`) o Zustand para manejar la configuración global (activar/desactivar sonido).

## 3. Momentos Clave para SFX (UX)
Identificamos los puntos críticos donde el sonido aporta valor:

| Acción | Tipo de Sonido | Descripción |
| :--- | :--- | :--- |
| **Tap/Click** | Click suave / Pop | Feedback inmediato al interactuar con botones o selecciones. |
| **Éxito** | Acorde positivo / Chime | Al responder correctamente una pregunta o terminar una lección. |
| **Error** | Tono suave bajo / Buzz | Al cometer un error. Debe ser informativo, no punitivo. |
| **Navegación** | Swoosh aireado | Transiciones entre pantallas (opcional, muy sutil). |
| **Desbloqueo** | Sonido mágico | Al desbloquear un nuevo nivel o logro. |

## 4. Estrategia de Implementación

### A. Estructura de Archivos
- **Assets**: `assets/sounds/` (click.mp3, success.mp3, error.mp3).
- **Lógica**: `src/features/audio/` (para mantenerlo modular).

### B. Arquitectura de Código
1.  **`SoundService`**: Un servicio o hook (`useSoundSystem`) que precargue los sonidos esenciales al iniciar la app para evitar latencia (lag) en la primera reproducción.
2.  **Global Toggle**: Una opción en `Settings` para que el usuario pueda silenciar los efectos FX sin silenciar su teléfono.

### C. Cambios Propuestos

#### 1. Nuevo Hook: `useSFX`
Crear un hook reutilizable que exponga funciones como `playClick()`, `playSuccess()`, `playError()`.

```typescript
// Ejemplo conceptual
const { playSound } = useSFX();
<Button onPress={() => { playSound('click'); handlePress(); }} />
```

#### 2. Componentes a Modificar
-   **`AppButton` / Componentes Base**: Integrar el sonido de "click" por defecto en el componente de botón reutilizable para que aplique a toda la app automáticamente.
-   **`ExerciseScreen` / `QuizLogic`**: Disparar sonidos de éxito/error en la validación de respuestas.
-   **`LevelCompletion`**: Sonido de celebración al terminar.

## 5. Pasos a Seguir

1.  [ ] **Recopilación de Assets**: Obtener archivos de audio libres de derechos (o generarlos).
2.  [ ] **Crear `SoundContext`**: Implementar la lógica de carga y reproducción.
3.  [ ] **Integrar en UI**: Conectar el contexto a los botones y eventos de éxito/error.
4.  [ ] **Añadir Configuración**: Switch de "Efectos de Sonido" en la pantalla de perfil/configuración.
