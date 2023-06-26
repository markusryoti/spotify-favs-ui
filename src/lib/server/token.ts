import { redirect, type Cookies } from "@sveltejs/kit";

type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>

type TokenResult = {
    access_token: string
    token_type: string
    scope: string
    expires_in: number
}

const maxAge = 60 * 59

export async function getAccessTokenFromRequest(cookies: Cookies, fetch: Fetch): Promise<string> {
    let accessToken = cookies.get('access_token')
    const refreshToken = cookies.get('refresh_token')

    if (accessToken) return accessToken

    if (!refreshToken) {
        throw redirect(302, "/");
    }

    const res = await fetch("http://localhost:8080/refresh-token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh_token: refreshToken
        })
    })

    const tokenResult: TokenResult = await res.json()

    accessToken = tokenResult.access_token

    setCookie(cookies, 'access_token', accessToken)

    return accessToken
}

export function setCookie(cookies: Cookies, name: string, value: string) {
    cookies.set(name, value, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: maxAge
    });
}
