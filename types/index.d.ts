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

export interface Reaction {
  id: string;
  icon: string;
  user: FirestoreUser;
}

export interface Tag {
  name: string;
  category: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  subtitle: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  reactions: Reaction[];
  user?: FirestoreUser;
  // attachments: string[]; TODO:: investigate adding it later
}

// types
export type AuthLand = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
