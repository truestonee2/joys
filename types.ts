export interface PromptOptions {
  style: string;
  mood: string;
  cameraAngle: string;
  lighting: string;
  quality: string;
  voiceActor: string;
  videoLength: string;
  videoSegment: string;
}

interface NarrationScript {
  type: 'narration';
  script: string;
}

interface DialogueScript {
  type: 'dialogue';
  script: Array<{
    character: string;
    line: string;
  }>;
}

export type VoiceScript = NarrationScript | DialogueScript;

export interface GeneratedPromptOutput {
  title: string;
  scenePrompts: string[];
  sceneJsons: Record<string, any>[];
  voiceScript: VoiceScript;
}
