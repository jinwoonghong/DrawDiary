/**
 * DrawDiary TypeScript 타입 정의
 */

// 감정 이모지 타입
export type MoodType = '😊' | '😢' | '😡' | '😴' | '😎';

// 이미지 타입
export type ImageType = 'photo' | 'sketch';

// 일기 엔트리
export interface DiaryEntry {
  id: string;              // 타임스탬프 기반 고유 ID
  date: string;            // 날짜 (YYYY-MM-DD)
  mood: MoodType;          // 감정 이모지
  text: string;            // 일기 텍스트 (최대 150자)
  imageUri?: string;       // 이미지 로컬 경로 (선택사항)
  imageType?: ImageType;   // 이미지 타입 (선택사항)
  createdAt: number;       // 생성 타임스탬프
  updatedAt: number;       // 수정 타임스탬프
}

// 일기 생성 DTO (Data Transfer Object)
export interface CreateDiaryDTO {
  date: string;
  mood: MoodType;
  text: string;
  imageUri?: string;
  imageType?: ImageType;
}

// 일기 수정 DTO
export interface UpdateDiaryDTO {
  mood?: MoodType;
  text?: string;
  imageUri?: string;
  imageType?: ImageType;
}

// 네비게이션 파라미터 타입
export type RootStackParamList = {
  Home: undefined;
  DiaryEdit: { entryId?: string; date?: string };
  DiaryView: { entryId: string };
  Sketch: { onSave: (uri: string) => void };
  Settings: undefined;
};

// 뷰 모드 타입
export type ViewMode = 'calendar' | 'timeline';
