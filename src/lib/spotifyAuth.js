/* -------------------------
  PKCE AUTHORIZATION FLOW
------------------------- */

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES;

const CODE_VERIFIER_KEY = 'spotify_pkce_code_verifier';
const ACCESS_TOKEN_KEY = 'spotify_access_token';
const REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const TOKEN_EXP_KEY = 'spotify_token_exp';

function toBase64Url(buffer) {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
	const base64 = btoa(binary);
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generateCodeVerifier(len = 64) {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
	let verifier = '';
	const randomVals = crypto.getRandomValues(new Uint8Array(len));
	for (let i = 0; i < len; i++) verifier += possible[randomVals[i] % possible.length];
	sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);
	return verifier;
}

export async function deriveCodeChallenge(verifier) {
	const data = new TextEncoder().encode(verifier);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return toBase64Url(digest);
}

export async function startLogin() {
	const verifier = await generateCodeVerifier();
	const challenge = await deriveCodeChallenge(verifier);

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		response_type: 'code',
		redirect_uri: REDIRECT_URI,
		code_challenge_method: 'S256',
		code_challenge: challenge,
		scope: SCOPES
	});

	window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export function getStoredAccessToken() {
	const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
	const exp = Number(sessionStorage.getItem(TOKEN_EXP_KEY) || 0);
	if (!token || !exp) return null;
	const now = Math.floor(Date.now() / 1000);
	if (now >= exp - 30) return null; // expired (kleine buffer)
	return token;
}

export async function exchangeCodeForToken(code) {
	const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
	if (!verifier) throw new Error('No code_verifier in sessionStorage');

	const body = new URLSearchParams({
		client_id: CLIENT_ID,
		grant_type: 'authorization_code',
		code,
		redirect_uri: REDIRECT_URI,
		code_verifier: verifier
	});

	const res = await fetch(SPOTIFY_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});

	if (!res.ok) throw new Error('Token exchange failed');
	const data = await res.json();

	const now = Math.floor(Date.now() / 1000);
	sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
	sessionStorage.setItem(TOKEN_EXP_KEY, String(now + data.expires_in));
	if (data.refresh_token) sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
}

export function clearAuth() {
	sessionStorage.removeItem(ACCESS_TOKEN_KEY);
	sessionStorage.removeItem(TOKEN_EXP_KEY);
	sessionStorage.removeItem(REFRESH_TOKEN_KEY);
	sessionStorage.removeItem(CODE_VERIFIER_KEY);
}

/* -------------------------
  VOLLEDIG VAN SPOTIFY TUTORIAL 
  https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
  https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
------------------------- */
