# Claude Issue Harness Demo

GitHub Issue 기반 Claude Code 자동 개발 Harness를 테스트하기 위한 최소 프로젝트입니다.

## 목표

이 저장소는 다음 흐름을 검증합니다.

```text
1. 사용자가 GitHub Issue 생성
2. Issue에 `ai-task` 라벨 추가 또는 댓글에 `@claude` 작성
3. GitHub Actions가 Issue 이벤트 감지
4. Claude Code Action 실행
5. Claude가 저장소 코드 분석
6. Claude가 별도 브랜치에서 수정
7. 테스트 / lint 실행
8. Pull Request 생성
9. 사람이 PR 리뷰 후 merge
```

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
npm test
npm run lint
```

## 의도된 실패 테스트

현재 `src/login.js`에는 데모용 버그가 있습니다.

```text
로그인 실패 시 "Error"만 반환함
```

`test/login.test.js`는 다음 메시지를 기대하므로 최초 실행 시 테스트가 실패합니다.

```text
아이디 또는 비밀번호를 확인해주세요.
```

이 실패를 GitHub Issue로 등록하고 Claude에게 수정 PR 생성을 요청하는 것이 이 데모의 목적입니다.

## Claude 작업 요청 예시

Issue 제목:

```text
로그인 실패 메시지를 명확하게 수정해줘
```

Issue 본문:

```md
## 작업 목적

로그인 실패 시 현재는 `Error`만 표시됩니다. 사용자에게 더 명확한 메시지를 반환하도록 수정해주세요.

## 현재 문제

`src/login.js`에서 로그인 실패 시 다음 응답을 반환합니다.

```js
{
  ok: false,
  message: 'Error'
}
```

## 기대 결과

로그인 실패 시 다음 응답을 반환해야 합니다.

```js
{
  ok: false,
  message: '아이디 또는 비밀번호를 확인해주세요.'
}
```

## 수정 범위

- `src/login.js`
- 필요한 경우 `test/login.test.js`

## 제외 범위

- 인증 방식 변경 금지
- 사용자 저장 구조 변경 금지
- dependency 추가 금지

## 검증 방법

```bash
npm test
npm run lint
```

@claude
이 이슈 내용을 기준으로 수정 PR을 만들어줘.
```

또는 Issue에 `ai-task` 라벨을 추가해도 됩니다.

## 주요 파일

```text
.github/workflows/claude-issue-worker.yml  # Claude Issue 기반 자동화 workflow
.github/workflows/node-ci.yml              # 기본 테스트/lint CI
.github/ISSUE_TEMPLATE/ai-task.md          # AI 작업 요청용 Issue 템플릿
HARNESS.md                                 # Harness 설계 문서
AGENTS.md                                  # AI 행동 지침
CLAUDE.md                                  # Claude Code 지침 연결 파일
src/login.js                               # 데모용 버그 포함 코드
test/login.test.js                         # 실패하는 테스트
```
