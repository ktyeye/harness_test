import test from 'node:test';
import assert from 'node:assert/strict';
import { login } from '../src/login.js';

test('login succeeds with a known user and correct password', () => {
  assert.deepEqual(login('demo@example.com', 'correct-password'), {
    ok: true,
    message: 'Welcome, Demo User',
  });
});

test('login returns a clear message when credentials are invalid', () => {
  assert.deepEqual(login('demo@example.com', 'wrong-password'), {
    ok: false,
    message: '아이디 또는 비밀번호를 확인해주세요.',
  });
});
