# CLAUDE.md

이 저장소에서 Claude Code가 작업할 때는 `AGENTS.md`의 지침을 최우선으로 따른다.

Claude는 이 저장소의 자동 개발 보조자이며, 최종 의사결정자가 아니다.

## 반드시 지킬 규칙

1. main 브랜치에 직접 push하지 않는다.
2. 항상 별도 브랜치에서 작업한다.
3. 작업 결과는 Pull Request로 제출한다.
4. Issue 또는 PR에서 요청한 범위를 벗어난 변경은 하지 않는다.
5. 운영 설정, secret, 배포 설정은 수정하지 않는다.
6. 테스트가 있으면 실행하고 결과를 PR 본문에 기록한다.
7. 변경 범위가 불명확하면 자동 수정을 중단하고 질문한다.
8. 대규모 리팩토링은 하지 않는다.
9. 자동 merge는 수행하지 않는다.
10. 사람 리뷰 후 merge되는 것을 전제로 작업한다.

## 작업 방식

Claude는 다음 순서로 작업한다.

```text
1. Issue 또는 PR 요청 내용을 읽는다.
2. 작업 목적, 수정 범위, 제외 범위, 검증 방법을 파악한다.
3. 저장소 구조를 확인한다.
4. 관련 파일만 최소 범위로 수정한다.
5. 가능한 테스트, lint, typecheck를 실행한다.
6. 결과를 별도 브랜치에 커밋한다.
7. Pull Request를 생성한다.
8. PR 본문에 작업 요약, 검증 결과, 사람 확인 필요사항을 작성한다.
```

## 우선 참조 문서

작업 시 다음 문서를 우선 확인한다.

```text
1. AGENTS.md
2. HARNESS.md
3. README.md
4. package.json / pyproject.toml / Makefile
5. .github/workflows/*
```

단, `.github/workflows/*` 파일은 Issue에서 명시적으로 요청하지 않는 한 수정하지 않는다.

## 금지 작업

다음 작업은 수행하지 않는다.

- main 브랜치 직접 push
- 자동 merge
- production 배포 실행
- secret, token, password, API key 수정 또는 출력
- `.env`, `.env.production` 파일 수정
- 운영 DB 또는 운영 API 관련 설정 변경
- 결제, 정산, 금융 거래 핵심 로직 변경
- DB migration 자동 적용
- 대규모 dependency 업데이트
- 대규모 아키텍처 변경
- Issue 범위를 벗어난 기능 추가

## 작업 중단 기준

다음 상황에서는 작업을 중단하고 Issue 또는 PR에 질문을 남긴다.

- 요구사항이 불명확한 경우
- 수정 범위가 너무 넓은 경우
- 운영 설정 변경이 필요한 경우
- secret 또는 인증정보가 필요한 경우
- DB migration이 필요한 경우
- 배포 설정 수정이 필요한 경우
- Issue 내용과 코드 상태가 충돌하는 경우
- 테스트 실패 원인이 요청 범위를 벗어나는 경우

## Pull Request 작성 형식

PR 제목:

```text
[AI] #{issue_number} {작업 요약}
```

PR 본문:

```md
## 작업 요약

- 수행한 작업을 요약한다.

## 관련 Issue

Closes #{issue_number}

## 변경 파일

- 주요 변경 파일 목록

## 검증 결과

- 실행한 명령어
- 결과

## 사람 리뷰 필요 사항

- 사람이 반드시 확인해야 하는 부분
```

## 핵심 원칙

```text
Claude는 코드를 직접 운영 반영하지 않는다.
Claude는 PR을 만들어주는 자동 협업자다.
최종 판단과 merge는 사람이 수행한다.
```
