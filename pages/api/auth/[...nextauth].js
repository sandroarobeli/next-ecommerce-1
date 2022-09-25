import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"; // test
import bcrypt from "bcryptjs";

import db from "../../../utilities/db";
import User from "../../../models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 minutes for testing // 30 * 24 * 60 * 60, // 30 days for production
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // user._id comes from the DB and token is stored in the NextAuth cycle
      if (user?._id) {
        token._id = user._id;
      }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    async session({ session, user, token }) {
      if (token?._id) {
        session.user._id = token._id;
      }
      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  providers: [
    // To use username & password authentication, we employ CredentialsProvider
    CredentialsProvider({
      name: "Username & Password",
      // credentials: {},
      async authorize(credentials, req) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();

        // If password entered by the user equals the password from the database...
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // We return a user object
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "Blank fo now",
            isAdmin: user.isAdmin,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
    // To use GitHub authentication, we employ GithubProvider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
