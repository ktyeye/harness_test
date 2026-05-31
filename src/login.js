const USERS = new Map([
  ['demo@example.com', { password: 'correct-password', name: 'Demo User' }],
]);

export function login(email, password) {
  const user = USERS.get(email);

  if (!user || user.password !== password) {
    // Intentional bug for Claude demo:
    // The Issue will ask Claude to replace this vague message with a clearer one.
    return {
      ok: false,
      message: 'Error',
    };
  }

  return {
    ok: true,
    message: `Welcome, ${user.name}`,
  };
}
