/**
 * Generates an SHA-256 fallback hash of a password/input using the built-in browser Web Crypto API.
 */
export async function hashPasswordSha256(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("Web Crypto API hashing failed, falling back to simple hash", err);
    // Simple fallback hash if running in environments lacking crypto.subtle
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `fb_${hash.toString(16)}`;
  }
}

/**
 * Interface representing standard JWT claims for administrative sessions.
 */
export interface JWTPayload {
  email: string;
  name: string;
  exp: number; // Expiration epoch in seconds
  iat: number; // Issued at epoch in seconds
}

// Secret key used to sign client-side administrative JWT sessions
const JWT_SIGNING_SECRET = "admin_dashboard_jwt_signing_key_2026_secure_hash_string";

/**
 * Base64Url encoder supporting UTF-8 and cross-browser environments.
 */
function toBase64Url(str: string): string {
  try {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  } catch {
    return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
}

/**
 * Base64Url decoder supporting UTF-8 and cross-browser environments.
 */
function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return atob(base64);
  }
}

/**
 * Generates a signed, valid JWT token with a 7-day expiration time.
 */
export async function createJWT(payload: Omit<JWTPayload, "exp" | "iat">, expiresInDays = 7): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: nowInSeconds,
    exp: nowInSeconds + (expiresInDays * 24 * 60 * 60)
  };

  const headerB64 = toBase64Url(JSON.stringify(header));
  const payloadB64 = toBase64Url(JSON.stringify(fullPayload));

  // Compute secure cryptographic signature over headers, payload and secret
  const signatureInput = `${headerB64}.${payloadB64}.${JWT_SIGNING_SECRET}`;
  const signature = await hashPasswordSha256(signatureInput);

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Decodes and verifies the signature and expiration status of a JWT token.
 * Returns decoded payload if perfectly verified, otherwise null.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;

  try {
    // 1. Re-compute signature to verify legitimacy
    const signatureInput = `${headerB64}.${payloadB64}.${JWT_SIGNING_SECRET}`;
    const expectedSignature = await hashPasswordSha256(signatureInput);

    if (signature !== expectedSignature) {
      console.warn("[JWT Verification] Signature does not match computed signature. Restricting access.");
      return null;
    }

    // 2. Parse payload
    const payloadStr = fromBase64Url(payloadB64);
    const payload = JSON.parse(payloadStr) as JWTPayload;

    // 3. Confirm expiration claims
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp < nowInSeconds) {
      console.warn(`[JWT Verification] Token has expired. Expired at: ${new Date(payload.exp * 1000).toISOString()}`);
      return null;
    }

    return payload;
  } catch (error) {
    console.error("[JWT Verification] Critical exception parsing token:", error);
    return null;
  }
}
