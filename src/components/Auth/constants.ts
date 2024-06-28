export const AuthErrorCodeToHumanReadableMap: Record<string, string> = {
  'auth/email-already-exists':
    'The provided email is already in use by an existing user',
  'auth/email-already-in-use':
    'The provided email is already in use by an existing user',
  'auth/invalid-credential': 'Password is incorrect',
  'auth/invalid-email':
    'The provided value for the email user property is invalid',
  'auth/invalid-password':
    'The provided value for the password user property is invalid. It must be a string with at least six characters',
  'auth/too-many-requests':
    'The number of requests exceeds the maximum allowed',
  'auth/user-not-found':
    'There is no existing user record corresponding to the provided identifier',
};
