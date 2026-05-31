# GitHub Issue 기반 Claude Code 자동 개발 Harness 기획서

## 1. 목적

이 문서는 특정 GitHub Repository에서 GitHub Issue를 작업 요청 단위로 사용하고, GitHub Actions와 Claude Code Action을 연동하여 코드 분석, 수정, 테스트, Pull Request 생성을 자동화하기 위한 Harness 설계 내용을 정의한다.

본 Harness의 목표는 다음과 같다.

- 사용자는 GitHub Issue를 통해 작업을 요청한다.
- 특정 라벨 또는 멘션을 통해 Claude 작업을 명시적으로 트리거한다.
- GitHub Actions는 Issue 이벤트를 감지하여 Claude Code Action을 실행한다.
- Claude는 저장소를 분석하고, 필요한 경우 별도 브랜치에서 코드를 수정한다.
- 수정 결과는 Pull Request로 제출한다.
- 최종 merge는 사람이 리뷰 후 수행한다.

이 Harness는 자동 배포 시스템이 아니라, 자동 개발 보조 시스템이다.

---

## 2. 전체 흐름

```text
1. 사용자가 GitHub Issue 생성
   예: "로그인 오류 수정해줘"

2. Issue 본문, 댓글 또는 라벨로 Claude 작업 요청
   예:
   - @claude
   - label: ai-task

3. GitHub Actions가 issue 이벤트 감지

4. Claude Code Action 실행

5. Claude가 저장소 코드 분석

6. Claude가 별도 브랜치에서 코드 수정

7. 테스트 / lint 실행

8. Pull Request 생성

9. 사람이 PR 리뷰 후 merge
```

---

## 3. 주요 구성 요소

| 구성 요소 | 역할 |
|---|---|
| GitHub Issue | 작업 요청서 |
| GitHub Label | AI 작업 실행 조건 |
| GitHub Actions | 이벤트 감지 및 자동 실행기 |
| Claude Code Action | 코드 분석 및 수정 수행자 |
| Pull Request | Claude 작업 결과물 |
| Branch Protection | main 브랜치 보호 장치 |
| GitHub Secrets | API Key 보관소 |
| AGENTS.md | AI 개발 보조자의 행동 지침 |
| CLAUDE.md | Claude Code용 지침 진입점 |

---

## 4. 실행 조건

Claude 작업은 모든 Issue에서 자동 실행하지 않는다.

초기 운영 단계에서는 다음 조건 중 하나를 만족할 때만 실행한다.

### 조건 1. Issue에 `ai-task` 라벨이 추가된 경우

```text
label: ai-task
```

### 조건 2. Issue 또는 PR 댓글에 `@claude`가 포함된 경우

```text
@claude
이 이슈 내용을 기준으로 수정 PR을 만들어줘.
```

이 방식을 사용하는 이유는 모든 Issue가 코드 수정 대상은 아니기 때문이다.

예를 들어 다음 Issue는 자동 실행 대상에서 제외하는 것이 안전하다.

- 단순 아이디어
- 기획 논의
- 운영 장애
- DB 변경
- 인프라 변경
- 보안 정책 변경
- 배포 설정 변경
- 비밀키 또는 인증 관련 변경

---

## 5. 권장 GitHub Label

| Label | 의미 |
|---|---|
| `ai-task` | Claude가 작업 가능한 Issue |
| `ai-review` | Claude에게 검토만 요청 |
| `ai-docs` | 문서 수정 요청 |
| `ai-bugfix` | 버그 수정 요청 |
| `ai-refactor-small` | 소규모 리팩토링 요청 |
| `needs-human-review` | 사람 검토 필요 |
| `blocked` | 자동 작업 중단 |
| `do-not-ai` | AI 작업 금지 |

초기에는 `ai-task` 하나만 사용해도 충분하다.

---

## 6. Issue 작성 규칙

Claude가 안정적으로 작업하려면 Issue는 가능한 구체적으로 작성해야 한다.

### 권장 Issue 템플릿

```md
## 작업 목적

무엇을 수정하거나 추가하려는지 설명한다.

## 현재 문제

현재 어떤 문제가 발생하는지 설명한다.

## 기대 결과

작업 완료 후 어떤 상태가 되어야 하는지 설명한다.

## 수정 범위

수정 가능한 파일, 모듈, 화면, API 등을 명시한다.

## 제외 범위

건드리면 안 되는 영역을 명시한다.

## 검증 방법

테스트, lint, 실행 명령어 등을 작성한다.

## 추가 참고사항

관련 로그, 스크린샷, 에러 메시지, 참고 문서를 첨부한다.
```

### 좋은 Issue 예시

````md
# 로그인 실패 시 에러 메시지 개선

## 작업 목적

로그인 실패 시 사용자에게 표시되는 에러 메시지를 더 명확하게 수정한다.

## 현재 문제

현재는 로그인 실패 시 "Error"만 표시된다.

## 기대 결과

- 비밀번호가 틀린 경우: "아이디 또는 비밀번호를 확인해주세요."
- 서버 오류인 경우: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

## 수정 범위

- frontend/src/pages/Login.tsx
- frontend/src/api/auth.ts

## 제외 범위

- 인증 로직 자체는 변경하지 않는다.
- 백엔드 API 스펙은 변경하지 않는다.

## 검증 방법

```bash
npm test
npm run lint
```
````

---

## 7. GitHub Actions Workflow 설계

Workflow 파일 위치:

```text
.github/workflows/claude-issue-worker.yml
```

GitHub Actions workflow는 YAML 파일로 정의하며, GitHub 이벤트, 예약 실행, 수동 실행 등에 의해 실행될 수 있다.

---

## 8. 기본 Workflow 초안

```yaml
name: Claude Issue Worker

on:
  issues:
    types: [labeled]
  issue_comment:
    types: [created]
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  claude:
    if: |
      github.event_name == 'workflow_dispatch' ||
      contains(github.event.issue.labels.*.name, 'ai-task') ||
      contains(github.event.comment.body, '@claude')

    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run Claude Code
        uses: anthropics/claude-code-action@main
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## 9. 예약 실행 설계

예약 실행은 초기 단계에서는 비활성화한다.

수동 실행과 Issue 기반 실행이 안정화된 후, 다음 용도로만 제한적으로 사용한다.

- 오래된 `ai-task` Issue 점검
- 실패한 테스트 분석
- 문서 최신화 후보 탐색
- dependency 변경 영향 분석
- 코드 품질 리포트 생성

예약 실행 예시:

```yaml
on:
  schedule:
    - cron: "0 18 * * *"
  workflow_dispatch:
```

위 cron은 UTC 기준이며, 한국시간 KST 03:00에 해당한다.

예약 실행은 실제 코드 수정보다는 리포트 생성 또는 Draft PR 생성까지만 허용하는 것이 안전하다.

---

## 10. Branch 전략

Claude는 main 브랜치에 직접 push하지 않는다.

권장 브랜치명:

```text
ai/issue-{issue_number}-{short-description}
```

예시:

```text
ai/issue-12-login-error-message
```

작업 완료 후 Claude는 해당 브랜치에서 Pull Request를 생성한다.

---

## 11. Pull Request 생성 규칙

Claude가 생성하는 PR은 다음 형식을 따른다.

### PR 제목

```text
[AI] #{issue_number} {작업 요약}
```

예시:

```text
[AI] #12 로그인 실패 메시지 개선
```

### PR 본문

````md
## 작업 요약

- 변경한 내용을 요약한다.

## 관련 Issue

Closes #{issue_number}

## 변경 파일

- 수정된 주요 파일 목록

## 검증 결과

```bash
npm test
npm run lint
```

## 주의사항

- 사람이 확인해야 할 부분
- 미해결 사항
- Claude가 판단하지 못한 부분
````

---

## 12. 테스트 / Lint 정책

Claude는 변경 후 가능한 검증 명령어를 실행한다.

권장 우선순위:

```text
1. package.json, pyproject.toml, Makefile, README 등을 확인해 테스트 명령어를 찾는다.
2. 명령어가 명시되어 있으면 실행한다.
3. 명령어가 없으면 실행하지 않고 PR 본문에 "검증 명령어를 찾지 못함"이라고 기록한다.
4. 테스트 실패 시 실패 로그와 원인을 PR 본문에 요약한다.
```

예시 명령어:

```bash
npm test
npm run lint
npm run typecheck
pytest
ruff check .
mypy .
```

---

## 13. 금지 작업

Claude는 다음 작업을 수행하지 않는다.

- main 브랜치 직접 push
- 자동 merge
- 운영 배포 실행
- production 환경 설정 변경
- 비밀키, 토큰, 인증정보 수정
- `.env`, `.env.production`, secret 파일 수정
- GitHub Actions 배포 workflow 수정
- DB migration 자동 적용
- 대규모 아키텍처 변경
- Issue 범위를 벗어난 기능 추가
- 사용자의 명시적 요청 없는 dependency 대규모 업데이트

---

## 14. 보안 정책

Anthropic API Key는 GitHub Secrets에 저장한다.

Secret 이름:

```text
ANTHROPIC_API_KEY
```

Workflow에서는 다음과 같이 참조한다.

```yaml
anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

API Key는 코드, README, Issue, PR 본문에 직접 작성하지 않는다.

---

## 15. GitHub 권한 정책

Workflow 권한은 최소 권한 원칙을 따른다.

권장 기본 권한:

```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
```

다음 설정은 사용하지 않는다.

```yaml
permissions: write-all
```

필요 권한이 늘어날 경우 사유를 문서화하고 팀 리뷰 후 변경한다.

---

## 16. Branch Protection 권장 설정

main 브랜치에는 보호 규칙을 적용한다.

권장 설정:

```text
- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging
- Do not allow bypassing the above settings
- Restrict who can push to matching branches
```

Claude가 생성한 PR도 사람의 리뷰를 거쳐야 한다.

---

## 17. 운영 단계

### 1단계: 수동 실행 검증

- GitHub Actions 기본 실행 확인
- `workflow_dispatch`로 수동 실행
- Claude API Key 연동 확인

### 2단계: Issue 기반 실행

- `ai-task` 라벨 기반 실행
- `@claude` 댓글 기반 실행
- 작은 문서 수정 작업부터 시작

### 3단계: 코드 수정 작업 확대

- 단순 버그 수정
- 테스트 실패 수정
- lint 오류 수정
- 소규모 리팩토링

### 4단계: 예약 실행 추가

- 정기 리포트
- 오래된 Issue 점검
- dependency 영향 분석
- Draft PR 생성

---

## 18. 초기 테스트 시나리오

### 테스트 1. README 수정

Issue:

```text
README에 로컬 실행 방법을 추가해줘.
```

기대 결과:

```text
Claude가 README 수정 PR 생성
```

### 테스트 2. Lint 오류 수정

Issue:

```text
현재 lint 오류를 확인하고 명확한 오류만 수정해줘.
```

기대 결과:

```text
Claude가 lint 오류 수정 PR 생성
```

### 테스트 3. 테스트 실패 분석

Issue:

```text
테스트 실패 원인을 분석하고, 수정 가능한 경우 수정해줘.
```

기대 결과:

```text
Claude가 테스트 실패 원인 요약 및 수정 PR 생성
```

---

## 19. 실패 시 처리 정책

Claude가 작업을 완료하지 못하면 다음 중 하나를 수행한다.

```text
1. Issue에 실패 원인을 댓글로 남긴다.
2. PR 본문에 미해결 사항을 기록한다.
3. 작업 범위가 불명확하면 사람에게 질문한다.
4. 보안상 위험한 작업이면 수행하지 않는다.
```

---

## 20. 최종 운영 원칙

이 Harness의 핵심 원칙은 다음과 같다.

```text
Claude는 main에 직접 반영하지 않는다.
Claude는 PR을 만들어주는 자동 협업자다.
최종 판단과 merge는 사람이 수행한다.
```
