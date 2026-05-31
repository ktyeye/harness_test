# 로그인 실패 메시지를 명확하게 수정해줘

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
