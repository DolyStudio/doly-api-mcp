# API Server

TypeScript + Express.js 기반의 간단한 REST API 서버입니다.

## 🚀 시작하기

### 개발 서버 실행
```bash
# 모노레포 루트에서
pnpm install
pnpm dev --filter=api

# 또는 apps/api 디렉토리에서
cd apps/api
pnpm dev
```

### 빌드
```bash
pnpm build --filter=api
```

### 프로덕션 실행
```bash
pnpm start --filter=api
```

## 📚 API 엔드포인트

### 헬스체크
- `GET /health` - 서버 상태 확인

### 사용자 API
- `GET /api/users` - 사용자 목록 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 새 사용자 생성

### MCP API
- `GET /api/mcp/status` - MCP 서비스 상태
- `POST /api/mcp/tools` - MCP 도구 실행

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Development**: tsx (TypeScript execution)
- **Security**: Helmet, CORS
- **Logging**: Morgan

## 📁 프로젝트 구조

```
apps/api/
├── src/
│   ├── routes/
│   │   └── api.ts      # API 라우터
│   └── index.ts        # 메인 서버 파일
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 환경 변수

| 변수명 | 기본값 | 설명 |
|--------|---------|------|
| `PORT` | 4000 | 서버 포트 |
| `NODE_ENV` | development | 실행 환경 | 