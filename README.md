# A1 생성형 AI 통합 엔진 Frontend

Next.js 16(App Router)과 React 19, TypeScript, Tailwind CSS 기반 웹 프론트엔드입니다.

## 프로젝트 목적

방송 제작자가 여러 AI 서비스를 하나의 웹 화면에서 이용할 수 있도록 이미지·영상 생성, 생성 진행 상태 확인, 생성 결과 조회·검색·재사용 기능을 제공한다. 프롬프트를 입력해 이미지를 생성하고 라이브러리에 저장할 수 있으며, 기존 이미지를 업로드하면 AI가 프롬프트를 역추출하여 이를 기반으로 변형 이미지를 다시 생성하는 기능도 지원한다.

## 프로젝트 기간

2026.06.01 ~ 2026.06.30

## 협업 문서

- [요구사항](docs/requirements.md)
- [디자인/화면 정의](docs/design.md)
- [배포](docs/deployment.md)

## 기술 스택

|      구분       | 기술                                                                                                                                                                                                                                                                                                              | 비고                                                  |
| :-------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| **프레임워크**  | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)                                                                                                     | App Router                                            |
|    **언어**     | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)                                                                                                                                                                                                 | 타입 안정성                                           |
|  **스타일링**   | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)                                                                                                                                                                                            |                                                       |
| **백엔드 연동** | ![REST API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge)                                                                                                                                                                                                                                     | Java 백엔드 API 소비 (인증·스토리지·DB, AI 생성 담당) |
|    **배포**     | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                                                                                                                                                                                                             | 호스팅                                                |
|  **코드 품질**  | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)                                                                                                 |                                                       |
|  **개발 도구**  | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white) |                                                       |
|  **버전 관리**  | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)                                                                                                                                                                                                             |                                                       |
|   **팀 협업**   | ![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)                                                                                                    |                                                       |

## 스크립트

| 명령어          | 설명           |
| --------------- | -------------- |
| `npm run dev`   | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드  |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint`  | ESLint 검사    |

## 프로젝트 구조

```
src/
  app/              # 라우트 (App Router) — 폴더가 곧 경로
  components/       # 공통 UI 컴포넌트 (Button, Input, Card 등)
  features/         # 도메인 기능 단위
    generation/     #   이미지·영상 생성
    library/        #   미디어 라이브러리
    reverse-prompt/ #   역프롬프트·변형 생성
    auth/           #   인증 (로그인/회원)
  lib/              # API 클라이언트(fetch 래퍼), 유틸
  hooks/            # 공통 커스텀 훅
  stores/           # 전역 상태 (도입 시 Zustand 등)
  types/            # 전역 공용 타입 (백엔드 응답 규약, 도메인 모델)
```

