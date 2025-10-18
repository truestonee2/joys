export const PROMPT_OPTIONS = {
  styles: {
    ko: ['시네마틱', '애니메이션', '다큐멘터리', '베이퍼웨이브', '3D 애니메이션', '레트로 필름', '초현실주의', '미니멀리스트', '필름 누아르', '사이버펑크'],
    en: ['Cinematic', 'Anime', 'Documentary', 'Vaporwave', '3D Animation', 'Retro Film', 'Surrealist', 'Minimalist', 'Film Noir', 'Cyberpunk'],
  },
  moods: {
    ko: ['웅장한', '행복한', '드라마틱한', '신비로운', '차분한', '에너지 넘치는', '로맨틱한', '긴장감 넘치는', '향수를 불러일으키는', '기발한'],
    en: ['Epic', 'Happy', 'Dramatic', 'Mysterious', 'Calm', 'Energetic', 'Romantic', 'Suspenseful', 'Nostalgic', 'Whimsical'],
  },
  cameraAngles: {
    ko: ['와이드 샷', '클로즈업', '드론 샷', '1인칭 시점', '더치 앵글', '로우 앵글', '하이 앵글', '트래킹 샷', '팬 샷'],
    en: ['Wide Shot', 'Close-up', 'Drone Shot', 'First-person POV', 'Dutch Angle', 'Low Angle', 'High Angle', 'Tracking Shot', 'Pan Shot'],
  },
  lighting: {
    ko: ['골든 아워', '네온', '어둡고 분위기 있는', '밝고 화창한', '부드러운 스튜디오 조명', '역광', '달빛', '볼류메트릭', '영화적 조명'],
    en: ['Golden Hour', 'Neon', 'Dark & Moody', 'Bright & Sunny', 'Soft Studio Light', 'Backlight', 'Moonlight', 'Volumetric', 'Cinematic'],
  },
  qualities: {
    ko: ['단순하게', '디테일하게', '극사실주의', '8K', '실사처럼', '스타일화된', '꿈처럼', '선명한 초점'],
    en: ['Simple', 'Detailed', 'Hyperrealistic', '8K', 'Photorealistic', 'Stylized', 'Dreamlike', 'Sharp Focus'],
  },
  voiceActors: {
    ko: ['전문 성우', 'AI 보이스', '립싱크 챔피언 코스플레이어', '차분한 내레이터', 'ASMR 아티스트'],
    en: ['Professional Voice Actor', 'AI Voice', 'Lip-Sync Champion Cosplayer', 'Calm Narrator', 'ASMR Artist'],
  },
  videoLengths: {
    ko: Array.from({ length: 10 }, (_, i) => `${i + 1}초`),
    en: Array.from({ length: 10 }, (_, i) => `${i + 1} second${i > 0 ? 's' : ''}`),
  },
  videoSegments: {
    ko: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
    en: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
  },
};
