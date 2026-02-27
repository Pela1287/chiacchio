import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales incompletas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            nombre: true,
            apellido: true,
            rol: true,
            emailVerified: true,
            sucursalId: true,
          }
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        if (!user.password) {
          throw new Error("Usuario sin contraseña");
        }

        const passwordValid = await compare(credentials.password, user.password);

        if (!passwordValid) {
          throw new Error("Contraseña incorrecta");
        }

        // BLOQUEO DEFINITIVO
        if (user.emailVerified === null) {
          throw new Error("Debes verificar tu email antes de iniciar sesión");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.nombre} ${user.apellido}`,
          role: user.rol,
          sucursalId: user.sucursalId ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || (user as any).rol;
        token.email = (user as any).email;
        (token as any).sucursalId = (user as any).sucursalId ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).sucursalId = (token as any).sucursalId ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      sucursalId?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    sucursalId?: string | null;
  }
}
