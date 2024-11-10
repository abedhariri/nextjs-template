import NextAuth from 'next-auth';
import github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email' },
        password: { label: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email === 'abedharirii@gmail.com' && credentials?.password === 'abed123123!.')
          return { email: credentials.email, name: 'Abdelhamid Hariri', id: '123' };

        return null;
      },
    }),
    github,
  ],
  pages: {
    signIn: '/signin',
  },
  trustHost: true,
});
