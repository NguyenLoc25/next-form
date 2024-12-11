import dbConnect from "@/lib/mongodb";
import { findOrCreateUser } from "@/lib/user";
import User from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT strategy for sessions
  },
  jwt: {
    secret: process.env.JWT_SECRET||process.env.NEXTAUTH_SECRET, // JWT secret for signing
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;
      // Check if the user exists in your database
      await findOrCreateUser({ email, name });
      
      return true; // Allow the sign-in to proceed if the user exists
    },

    async session({ session, token }) {
      // Include the username (or any other info you want) in the session
      session.user._id = token?._id||"";

      return session;
    },
    async jwt({ user, token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user&&user._id) {
        token._id = user._id.toString(); // Save the user's _id in the token
      } else if (token?.email) {
        // On subsequent sessions, fetch user info from the database using the email
        await dbConnect();
        const userData = await User.findOne({ email: token.email });
        if (userData) {
          token._id = userData._id.toString(); // Assign _id from the user in the database
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };