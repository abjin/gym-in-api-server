# 짐인 (Gym-In) API 서버

헬스장 출석 관리 및 소셜 피트니스 애플리케이션의 백엔드 API 서버입니다.

## 📋 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [API 문서](#api-문서)
- [설치 및 실행](#설치-및-실행)
- [환경 변수 설정](#환경-변수-설정)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [주요 모듈](#주요-모듈)

## 🎯 개요

짐인(Gym-In)은 헬스장 이용자들이 운동 출석을 관리하고 다른 사용자들과 소통할 수 있는 소셜 피트니스 플랫폼입니다. 사용자들은 헬스장 체크인, 운동 기록, 챌린지 참여, 소셜 피드 활동을 통해 동기부여를 받고 꾸준한 운동 습관을 만들어 갈 수 있습니다.

## ✨ 주요 기능

### 🔐 사용자 인증 및 관리
- **소셜 로그인**: 카카오 로그인 지원
- **프로필 관리**: 닉네임, 프로필 이미지 설정
- **JWT 기반 인증**: 안전한 API 접근 제어

### 📍 출석 관리
- **체크인 시스템**: 헬스장 출석 체크
- **운동 기록**: 부위별 운동 기록 (가슴, 등, 어깨, 팔, 다리, 유산소)
- **목표 설정**: 주간/월간 출석 목표 설정 및 추적
- **출석 통계**: 총 출석 일수 및 기간별 출석 현황

### 🏆 챌린지 시스템
- **출석 시간 챌린지**: 특정 시간대 출석 인증 챌린지
- **목표 일수 설정**: 개인별 챌린지 목표 일수 설정
- **리워드 시스템**: 챌린지 달성 시 경험치 보상
- **인증 로그**: 일별 챌린지 참여 기록

### 📈 레벨 및 랭킹
- **경험치 시스템**: 출석, 목표 달성, 챌린지 참여로 경험치 획득
- **사용자 레벨**: 경험치 기반 레벨 시스템
- **랭킹**: 경험치 기반 사용자 랭킹
- **레벨 로그**: 경험치 획득 내역 추적

### 📱 소셜 피드
- **게시물 작성**: 텍스트 및 이미지 게시물 작성
- **댓글 시스템**: 게시물에 댓글 작성 및 관리
- **좋아요 기능**: 게시물 좋아요/좋아요 취소
- **개인 피드**: 내 게시물 및 댓글 관리

### 🖼️ 이미지 관리
- **S3 연동**: AWS S3를 통한 이미지 업로드
- **Presigned URL**: 안전한 이미지 업로드 URL 생성
- **AI 이미지 검증**: OpenRouter AI를 통한 헬스장 이미지 검증

## 🛠️ 기술 스택

### Backend Framework
- **NestJS**: TypeScript 기반 Node.js 프레임워크
- **Express**: 웹 애플리케이션 프레임워크

### Database
- **MySQL**: 관계형 데이터베이스
- **Prisma**: ORM 및 데이터베이스 관리
- **Redis**: 캐싱 및 세션 관리

### Authentication
- **JWT**: JSON Web Token 인증
- **Passport**: 인증 미들웨어
- **카카오 OAuth**: 소셜 로그인

### External Services
- **AWS S3**: 이미지 저장소
- **OpenRouter**: AI 이미지 검증
- **OpenAI API**: 이미지 분석

### Development Tools
- **TypeScript**: 정적 타입 언어
- **Swagger**: API 문서화
- **Jest**: 테스트 프레임워크
- **ESLint + Prettier**: 코드 품질 관리

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │   Database      │
│   (Client)      │◄──►│   (NestJS)      │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   External      │
                    │   Services      │
                    │                 │
                    │ • AWS S3        │
                    │ • OpenRouter    │
                    │ • Redis         │
                    │ • Kakao OAuth   │
                    └─────────────────┘
```

## 📚 API 문서

개발 환경에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다.

- **URL**: `http://localhost:3000/api-docs`
- **인증**: Basic Auth (환경 변수에서 설정)

### 주요 API 엔드포인트

- `POST /users/kakao-login` - 카카오 로그인
- `GET /users` - 사용자 정보 조회
- `POST /attendances/check-in` - 헬스장 체크인
- `GET /attendances` - 출석 기록 조회
- `POST /feeds` - 피드 게시물 작성
- `GET /feeds` - 피드 목록 조회
- `GET /challenges/available` - 참여 가능한 챌린지 목록
- `POST /challenges/:id/participants` - 챌린지 참여
- `GET /rankings` - 사용자 랭킹
- `GET /levels` - 사용자 레벨 정보

## 🚀 설치 및 실행

### 필수 조건
- Node.js v22.11.0
- MySQL 8.0+
- Redis

### 설치
```bash
# 저장소 클론
git clone <repository-url>
cd gym-in-api-server

# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate deploy

# Prisma 클라이언트 생성
npx prisma generate
```

### 실행
```bash
# 개발 환경
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

### 테스트
```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## ⚙️ 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 서버 설정
NODE_ENV=development
PORT=3000

# 데이터베이스
DATABASE_URL="mysql://username:password@localhost:3306/gym_in"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=ap-northeast-2

# OpenRouter AI
OPENROUTER_API_KEY=your-openrouter-key

# Swagger 인증
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=password

# 카카오 OAuth (필요시)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

## 🗄️ 데이터베이스 스키마

### 주요 테이블

#### Users (사용자)
- 사용자 기본 정보, 총 경험치 관리

#### Attendances (출석)
- 일별 출석 기록 및 운동 부위 기록

#### Feeds (피드)
- 사용자 게시물, 이미지, 댓글/좋아요 수

#### Challenges (챌린지)
- 챌린지 정보, 기간, 보상 설정

#### ChallengeParticipants (챌린지 참여자)
- 사용자별 챌린지 참여 현황 및 진행도

#### Rankings (랭킹)
- 경험치 기반 사용자 순위

## 📦 주요 모듈

### Core Modules
- **AppModule**: 메인 애플리케이션 모듈
- **AuthModule**: JWT 인증 모듈
- **DbModule**: 데이터베이스 연결 모듈

### Feature Modules
- **UsersModule**: 사용자 관리
- **AttendancesModule**: 출석 관리
- **FeedsModule**: 소셜 피드
- **ChallengesModule**: 챌린지 시스템
- **LevelsModule**: 레벨 시스템
- **RankingsModule**: 랭킹 시스템

### Library Modules
- **S3Module**: AWS S3 이미지 업로드
- **OpenrouterModule**: AI 이미지 검증
- **DateModule**: 날짜 유틸리티

## 🤖 프롬프트 엔지니어링

이 프로젝트는 OpenRouter AI를 활용하여 헬스장 이미지 검증 기능을 구현합니다. AI 모델과의 효과적인 상호작용을 위해 정교한 프롬프트 엔지니어링 기법을 적용했습니다.

### 이미지 검증 시스템

#### 사용 모델
- **모델**: `google/gemini-flash-1.5-8b`
- **목적**: 실제 운영 중인 헬스장 이미지 판별
- **응답 형식**: JSON (`{result: true/false}`)

#### 프롬프트 구조

```typescript
// 시스템 프롬프트 (역할 정의)
const systemPrompt = `
You are an AI that analyzes images to determine if they show a real, 
physical gym or fitness center currently in operation. 
Photos of gyms or drawings/illustrations of gyms should return {result: false}. 
Only return {result: true} if the image shows a real, operating gym or 
fitness center in its actual physical space. 
Respond with JSON format {result: true/false}.
`;

// 사용자 프롬프트 (구체적 질문)
const userPrompt = `
Is this image showing a real, operating gym (not a photo or drawing of a gym)?
`;
```

#### 프롬프트 설계 원칙

1. **명확한 역할 정의**
   - AI의 역할을 "헬스장 이미지 분석 전문가"로 구체적으로 명시
   - 분석 목적과 기준을 명확하게 제시

2. **구체적인 판별 기준**
   - ✅ 실제 운영 중인 헬스장 → `true`
   - ❌ 헬스장 사진의 사진 → `false`
   - ❌ 헬스장 그림/일러스트 → `false`

3. **구조화된 응답 형식**
   - JSON 형태로 일관된 응답 요구
   - `response_format: { type: 'json_object' }` 설정

4. **멀티모달 입력**
   - 이미지 URL과 텍스트 질문을 함께 전송
   - 시각적 정보와 언어적 지시사항의 조합

### 프롬프트 최적화 전략

#### 1. 반복적 개선
```typescript
// 초기 프롬프트 (모호함)
"Is this a gym image?"

// 개선된 프롬프트 (구체적)
"Is this image showing a real, operating gym (not a photo or drawing of a gym)?"
```

#### 2. 예외 상황 처리
- 사진 속 사진 구별
- 일러스트/그림 구별
- 폐업한 헬스장 구별

#### 3. 일관성 확보
- 동일한 시스템 프롬프트 재사용
- 표준화된 응답 형식
- 명확한 판별 기준

### 활용 사례

#### 체크인 이미지 검증
```typescript
// 사용자가 헬스장 체크인 시 이미지 업로드
const isValidGymImage = await openrouterService.validateGymImage(imageUrl);

if (isValidGymImage.result) {
  // 유효한 헬스장 이미지 - 체크인 허용
  await attendanceService.checkIn(userId, imageUrl);
} else {
  // 잘못된 이미지 - 체크인 거부
  throw new BadRequestException('올바른 헬스장 이미지를 업로드해주세요.');
}
```
