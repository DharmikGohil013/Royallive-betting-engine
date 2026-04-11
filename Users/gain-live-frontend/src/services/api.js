const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("gain-live-user-token") || "";
}

function setToken(token) {
  localStorage.setItem("gain-live-user-token", token);
}

function clearAuth() {
  localStorage.removeItem("gain-live-user-token");
  localStorage.removeItem("gain-live-user");
}

async function api(path, options = {}) {
  const { method = "GET", body, params, auth = true } = options;
  let url = `${API_BASE}/api/user${path}`;

  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearAuth();
    throw new Error("Session expired");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ==================== AUTH ====================
export async function register(form) {
  const data = await api("/register", { method: "POST", body: form, auth: false });
  if (data.token) {
    setToken(data.token);
    localStorage.setItem("gain-live-user", JSON.stringify(data.user));
  }
  return data;
}

export async function login(payload) {
  const data = await api("/login", { method: "POST", body: payload, auth: false });
  if (data.token) {
    setToken(data.token);
    localStorage.setItem("gain-live-user", JSON.stringify(data.user));
  }
  return data;
}

export async function verifyToken() {
  return api("/verify");
}

export function logout() {
  clearAuth();
}

export function isLoggedIn() {
  return !!getToken();
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("gain-live-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ==================== PROFILE ====================
export async function getProfile() {
  return api("/profile");
}

export async function updateProfile(data) {
  return api("/profile", { method: "PUT", body: data });
}

export async function changePassword(currentPassword, newPassword) {
  return api("/change-password", { method: "PUT", body: { currentPassword, newPassword } });
}

// ==================== WALLET ====================
export async function getWallet() {
  return api("/wallet");
}

export async function requestDeposit(amount, paymentMethod, reference) {
  return api("/deposit", { method: "POST", body: { amount, paymentMethod, reference } });
}

export async function requestWithdraw(amount, paymentMethod, reference) {
  return api("/withdraw", { method: "POST", body: { amount, paymentMethod, reference } });
}

export async function getTransactions(params = {}) {
  return api("/transactions", { params });
}

// ==================== BETS ====================
export async function placeBet(betData) {
  return api("/bets", { method: "POST", body: betData });
}

export async function getBetHistory(params = {}) {
  return api("/bets", { params });
}

// ==================== PUBLIC DATA ====================
export async function getGames(params = {}) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`${API_BASE}/api/user/games${qs}`);
  return res.json();
}

export async function getFeaturedGames() {
  const res = await fetch(`${API_BASE}/api/user/games/featured`);
  return res.json();
}

export async function getLiveCricket() {
  const res = await fetch(`${API_BASE}/api/user/cricket/live`);
  return res.json();
}

export async function getPaymentMethods() {
  const res = await fetch(`${API_BASE}/api/user/payment-methods`);
  return res.json();
}

export async function getPublicSetting(key) {
  const res = await fetch(`${API_BASE}/api/user/settings/${encodeURIComponent(key)}`);
  return res.json();
}

// ==================== NOTIFICATIONS ====================
export async function getNotifications(params = {}) {
  return api("/notifications", { params });
}
