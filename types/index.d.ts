export interface Errors {
  code?: number;
  message?: string;
}

export interface FirestoreUser {
  uid: string;
  email?: string;
  displayName?: string;
  emailVerified?: boolean;
  photoURL?: string;
}

// types
export type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
