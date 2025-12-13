import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { resend } from "./resend";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import prisma from "./prisma";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://klarna-ruby.vercel.app"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        from: "noreply@gmail.com",
        to: data.user.email,
        subject: "Reset Password",
        html: `Reset password: ${data.url}`
      })
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const connectedUserWithRole = await prisma.user.findFirst({
        where: {
          id: user.id
        }
      })
      return {
        user: {
          ...user,
          role: connectedUserWithRole?.role
        },
        session
      };
    }),
  ]
});