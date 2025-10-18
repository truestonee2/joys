import { GoogleGenAI, Type } from "@google/genai";
import type { PromptOptions, GeneratedPromptOutput } from '../types';
import { PROMPT_OPTIONS } from '../constants';

// Fix: Initialize the GoogleGenAI client according to the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Fix: Use a recommended model for text tasks.
const model = 'gemini-2.5-flash';

/**
 * Generates suggestions for prompt options based on a user's video idea.
 */
export async function getPromptSuggestions(
  promptIdea: string,
  language: 'ko' | 'en'
): Promise<Partial<PromptOptions>> {
  const langOptions = {
    style: PROMPT_OPTIONS.styles[language].join(', '),
    mood: PROMPT_OPTIONS.moods[language].join(', '),
    cameraAngle: PROMPT_OPTIONS.cameraAngles[language].join(', '),
    lighting: PROMPT_OPTIONS.lighting[language].join(', '),
    quality: PROMPT_OPTIONS.qualities[language].join(', '),
    voiceActor: PROMPT_OPTIONS.voiceActors[language].join(', '),
  };

  const prompt = language === 'en'
    ? `Based on the video idea "${promptIdea}", suggest the best options from the given lists. Only choose from the provided options for each category.
      - Style: ${langOptions.style}
      - Mood: ${langOptions.mood}
      - Camera Angle: ${langOptions.cameraAngle}
      - Lighting: ${langOptions.lighting}
      - Quality: ${langOptions.quality}
      - Voice Actor Style: ${langOptions.voiceActor}`
    : `비디오 아이디어 "${promptIdea}"를 바탕으로, 주어진 목록에서 가장 적합한 옵션을 제안해주세요. 각 카테고리별로 제공된 옵션 중에서만 선택해야 합니다.
      - 스타일: ${langOptions.style}
      - 분위기: ${langOptions.mood}
      - 카메라 앵글: ${langOptions.cameraAngle}
      - 조명: ${langOptions.lighting}
      - 품질: ${langOptions.quality}
      - 성우 스타일: ${langOptions.voiceActor}`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      style: { type: Type.STRING, description: `Suggested style. Must be one of: ${PROMPT_OPTIONS.styles[language].join(', ')}` },
      mood: { type: Type.STRING, description: `Suggested mood. Must be one of: ${PROMPT_OPTIONS.moods[language].join(', ')}` },
      cameraAngle: { type: Type.STRING, description: `Suggested camera angle. Must be one of: ${PROMPT_OPTIONS.cameraAngles[language].join(', ')}` },
      lighting: { type: Type.STRING, description: `Suggested lighting. Must be one of: ${PROMPT_OPTIONS.lighting[language].join(', ')}` },
      quality: { type: Type.STRING, description: `Suggested quality. Must be one of: ${PROMPT_OPTIONS.qualities[language].join(', ')}` },
      voiceActor: { type: Type.STRING, description: `Suggested voice actor style. Must be one of: ${PROMPT_OPTIONS.voiceActors[language].join(', ')}` },
    },
    required: ['style', 'mood', 'cameraAngle', 'lighting', 'quality', 'voiceActor'],
  };

  try {
    // Fix: Use ai.models.generateContent to call the Gemini API with a structured response schema.
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    // Fix: Extract and parse the JSON response from the 'text' property.
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error getting prompt suggestions:", error);
    throw new Error("Failed to get suggestions from AI. Please try again.");
  }
}

/**
 * Generates a structured video prompt including title, scenes, and voice script.
 */
export async function generateStructuredPrompt(
  promptIdea: string,
  options: PromptOptions,
  language: 'ko' | 'en'
): Promise<GeneratedPromptOutput> {
  const optionsString = Object.entries(options)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const prompt = language === 'en'
    ? `You are an expert video scriptwriter and prompt engineer.
      Based on the following video idea and parameters, generate a complete video production plan.
      
      Video Idea: "${promptIdea}"
      Parameters:
      ${optionsString}
      
      Your output must be a JSON object that strictly follows the provided schema.
      
      The plan should include:
      1.  "title": A catchy and short title for the video.
      2.  "scenePrompts": An array of strings. Each string is a detailed visual prompt for a video generation AI, describing one scene. The number of scenes must be exactly ${options.videoSegment}. Each prompt should incorporate these elements: ${options.style}, ${options.mood}, ${options.cameraAngle}, ${options.lighting}, ${options.quality}.
      3.  "sceneJsons": An array of JSON objects. Each object provides structured data for a scene, corresponding to the scenePrompts. This can include details like camera movements, object positions, character expressions, etc. Be creative and detailed. The number of objects must match the number of scene prompts.
      4.  "voiceScript": A creative voice-over script for the video that brings the idea to life. It must be a full, original script, not just a repetition of the video idea.
          - Based on the idea, determine if the script should be a narration or a dialogue.
          - If it's narration, the "type" must be "narration" and "script" must be a single string containing the full narration text.
          - If it's a dialogue between characters, the "type" must be "dialogue" and "script" must be a JSON STRING of an array of objects, where each object has "character" and "line" keys. The voice actor style is: ${options.voiceActor}.
      
      The total video length is about ${options.videoLength}, so the script should be timed accordingly.
      Generate the output in English.`
    : `당신은 전문 비디오 스크립트 작가이자 프롬프트 엔지니어입니다.
      다음 비디오 아이디어와 매개변수를 기반으로 완전한 비디오 제작 계획을 생성해주세요.

      비디오 아이디어: "${promptIdea}"
      매개변수:
      ${optionsString}

      출력은 제공된 스키마를 엄격히 따르는 JSON 객체여야 합니다.

      계획에는 다음이 포함되어야 합니다:
      1. "title": 비디오를 위한 눈길을 끄는 짧은 제목.
      2. "scenePrompts": 문자열 배열. 각 문자열은 비디오 생성 AI를 위한 상세한 시각적 프롬프트이며, 한 장면을 설명합니다. 장면의 수는 반드시 ${options.videoSegment}개여야 합니다. 각 프롬프트는 다음 요소들을 포함해야 합니다: ${options.style}, ${options.mood}, ${options.cameraAngle}, ${options.lighting}, ${options.quality}.
      3. "sceneJsons": JSON 객체 배열. 각 객체는 scenePrompts에 해당하는 장면에 대한 구조화된 데이터를 제공합니다. 카메라 움직임, 물체 위치, 캐릭터 표정 등과 같은 세부 정보를 포함할 수 있습니다. 창의적이고 상세하게 작성해주세요. 객체의 수는 scenePrompts의 수와 일치해야 합니다.
      4. "voiceScript": 아이디어를 생생하게 구현하는 창의적인 보이스오버 스크립트. 단순히 비디오 아이디어를 반복하는 것이 아니라 완전한 오리지널 스크립트여야 합니다.
         - 아이디어를 바탕으로 스크립트가 내레이션이어야 할지, 대화여야 할지 판단해주세요.
         - 내레이션인 경우 "type"은 "narration"이어야 하고 "script"는 전체 내레이션 텍스트를 포함하는 단일 문자열이어야 합니다.
         - 캐릭터 간의 대화인 경우 "type"은 "dialogue"여야 하고 "script"는 객체 배열의 JSON 문자열이어야 합니다. 각 객체에는 "character"와 "line" 키가 있어야 합니다. 성우 스타일은 다음과 같습니다: ${options.voiceActor}.

      총 비디오 길이는 약 ${options.videoLength}이므로 스크립트 시간을 그에 맞게 조절해야 합니다.
      결과를 한국어로 생성해주세요.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy title for the video." },
      scenePrompts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of detailed text prompts for each video scene/segment."
      },
      sceneJsons: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          description: "Structured data for a single scene.",
          properties: {
            camera: { type: Type.STRING, description: "Detailed camera movement, angle, and focus instructions." },
            lighting: { type: Type.STRING, description: "Specific lighting setup for the scene." },
            sound: { type: Type.STRING, description: "Key sound effects and ambient audio." },
            visuals: { type: Type.STRING, description: "Description of key visual elements, characters, or actions." },
          },
          required: ['camera', 'lighting', 'sound', 'visuals']
        },
        description: "An array of JSON objects detailing each scene."
      },
      voiceScript: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Either 'narration' or 'dialogue'." },
          script: { type: Type.STRING, description: "If type is 'narration', this is the script text. If type is 'dialogue', this is a JSON string of an array of {character, line} objects." },
        },
        required: ['type', 'script'],
      },
    },
    required: ['title', 'scenePrompts', 'sceneJsons', 'voiceScript'],
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const jsonResult = JSON.parse(response.text.trim());

    // Post-process the voiceScript if it's a dialogue, as it's returned as a JSON string.
    if (jsonResult.voiceScript && jsonResult.voiceScript.type === 'dialogue') {
      try {
        jsonResult.voiceScript.script = JSON.parse(jsonResult.voiceScript.script);
      } catch (e) {
        console.error("Failed to parse dialogue script JSON:", e);
        // Fallback to narration to avoid crashing the app.
        jsonResult.voiceScript = {
          type: 'narration',
          script: 'Error: Could not parse dialogue script from AI response.',
        };
      }
    }
    
    // Data validation to prevent crashes
    if (!jsonResult.title || !Array.isArray(jsonResult.scenePrompts) || !Array.isArray(jsonResult.sceneJsons) || !jsonResult.voiceScript) {
      throw new Error("The model returned an incorrectly structured response.");
    }

    return jsonResult as GeneratedPromptOutput;

  } catch (error) {
    console.error("Error generating structured prompt:", error);
    // Provide a more specific error message if available
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    if (errorMessage.includes("response_schema")) {
        throw new Error(`The AI failed to generate data matching the required structure. Please try refining your idea or options. Details: ${errorMessage}`);
    }
    throw new Error(`Failed to generate prompts from AI. Please try again. Details: ${errorMessage}`);
  }
}