const cookieConfigTemplate = () => {
    return `import { parseDuration } from "../utils/duration.js";

export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseDuration(process.env.ACCESS_TOKEN_EXPIRES_IN)
}

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN),
    path: '/api/auth'
}`
}

export default cookieConfigTemplate;
