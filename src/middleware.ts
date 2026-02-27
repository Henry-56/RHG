import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default function middleware() {
    return;
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: [],
};
