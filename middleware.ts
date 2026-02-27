import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Host-next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("__Secure-next-auth.callback-url");
}

export async function middleware(request: NextRequest) {
    let token: Awaited<ReturnType<typeof getToken>> = null;
    try {
        token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    } catch {
        const isLoginPage = request.nextUrl.pathname === "/admin/login";
        if (isLoginPage) {
            const response = NextResponse.next();
            clearAuthCookies(response);
            return response;
        }

        const loginUrl = new URL("/admin/login", request.nextUrl.origin);
        const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        const response = NextResponse.redirect(loginUrl);
        clearAuthCookies(response);
        return response;
    }

    const isLoggedIn = Boolean(token);
    const isLoginPage = request.nextUrl.pathname === "/admin/login";

    if (!isLoggedIn && !isLoginPage) {
        const loginUrl = new URL("/admin/login", request.nextUrl.origin);
        const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
