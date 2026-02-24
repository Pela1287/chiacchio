import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({

  session: {
    strategy: "jwt",
  },

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password)
          return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user)
          return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch)
          return null;

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.rol, // ESTO ES LA CLAVE
          name: user.nombre || user.email,
        };

      },

    }),

  ],

  callbacks: {

    async jwt({ token, user }) {

      if (user) {

        token.id = user.id;
        token.role = user.role;
        token.email = user.email;

      }

      return token;

    },

    async session({ session, token }) {

      if (session.user) {

        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.email = token.email as string;

      }

      return session;

    },

  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

});

export { handler as GET, handler as POST };