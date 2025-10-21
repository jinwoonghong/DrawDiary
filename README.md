# DrawDiary - 그림일기 모바일 앱

> 하루를 2~3문장과 한 장의 그림으로 기록하는 가장 간단한 일기 앱

## 프로젝트 개요

DrawDiary는 바쁜 현대인을 위한 미니멀한 그림일기 앱입니다. 긴 글쓰기 부담 없이, 짧은 텍스트와 사진 또는 스케치로 하루를 아름답게 기록할 수 있습니다.

### 핵심 특징
- 📝 **간결한 기록**: 2~3문장 (150자)으로 하루를 요약
- 🎨 **시각적 표현**: 사진 또는 스케치로 감성 표현
- 😊 **감정 기록**: 오늘의 기분을 이모지로 선택
- 📅 **캘린더 뷰**: 한눈에 보는 나의 일기 기록
- 🍎 **애플 디자인**: iOS Human Interface Guidelines 기반 UI

## 기술 스택

- **Framework**: React Native 0.73
- **Language**: TypeScript
- **State Management**: React Context API + Hooks
- **Storage**: AsyncStorage (로컬)
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper (iOS 스타일 커스터마이징)

## 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- React Native CLI
- Xcode 14.0+ (iOS 개발)
- Android Studio (Android 개발)

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/DrawDiary.git
cd DrawDiary

# 의존성 설치
npm install

# iOS 의존성 설치 (Mac만 해당)
cd ios && pod install && cd ..
```

### 실행

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 프로젝트 구조

```
src/
├── components/      # 재사용 가능한 UI 컴포넌트
├── screens/         # 화면 컴포넌트
├── navigation/      # 네비게이션 설정
├── contexts/        # Context API
├── hooks/           # Custom Hooks
├── utils/           # 유틸리티 함수
├── constants/       # 상수 (색상, 타이포그래피 등)
└── types/           # TypeScript 타입 정의
```

## 문서

- [기획서](./docs/기획서.md) - 상세 프로젝트 기획 문서
- [기술스택](./docs/기술스택.md) - 기술 스택 상세 설명

## 개발 로드맵

### Phase 1: MVP (4주)
- [x] 프로젝트 기획
- [ ] 기본 UI 구현
- [ ] 일기 작성/조회 기능
- [ ] 이미지 추가 기능
- [ ] 스케치 기능
- [ ] 로컬 저장소 연동

### Phase 2: 확장 (추후)
- [ ] Firebase 연동
- [ ] 클라우드 동기화
- [ ] 소셜 기능
- [ ] 프리미엄 기능

## 기여하기

현재 MVP 개발 중이므로 외부 기여는 받지 않습니다. 향후 오픈 소스로 전환될 예정입니다.

## 라이선스

이 프로젝트는 현재 비공개입니다.

## 연락처

문의사항이 있으시면 이슈를 생성해주세요.

---

**프로젝트 시작일**: 2025-10-21
**현재 상태**: 기획 완료, 개발 시작 전
