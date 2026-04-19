const API_BASE = import.meta.env.VITE_API_URL ?? "";

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

// ==================== MARQUEE ====================
export async function getMarqueeItems() {
  const res = await fetch(`${API_BASE}/api/user/marquee`);
  return res.json();
}

// ==================== BLOCK / REPORT ====================
export async function blockUser(userId) {
  return api("/block", { method: "POST", body: { userId } });
}

export async function unblockUser(userId) {
  return api("/unblock", { method: "POST", body: { userId } });
}

export async function reportUser(userId, reason) {
  return api("/report", { method: "POST", body: { userId, reason } });
}

export async function getBlockedUsers() {
  return api("/blocked-users");
}

// ==================== HELP CENTER ====================
export async function submitHelpRequest(subject, message, category) {
  return api("/help", { method: "POST", body: { subject, message, category } });
}

export async function getMyHelpRequests() {
  return api("/help");
}

export async function getFAQ() {
  return api("/support/faq", { auth: false });
}

// ==================== PROMOTIONS ====================
export async function getPromotions() {
  const res = await fetch(`${API_BASE}/api/user/promotions`);
  return res.json();
}

export async function submitPromotionRequest(data) {
  return api("/promotions/request", { method: "POST", body: data });
}

// ==================== REFERRAL ====================
export async function getReferralInfo() {
  return api("/referral");
}

// ==================== HALL OF GLORY ====================
export async function getHallOfGlory() {
  const res = await fetch(`${API_BASE}/api/user/hall-of-glory`);
  return res.json();
}

// ==================== POLICIES ====================
export async function getPolicies() {
  const res = await fetch(`${API_BASE}/api/user/policies`);
  return res.json();
}

// ==================== ABOUT ====================
export async function getAboutInfo() {
  const res = await fetch(`${API_BASE}/api/user/about`);
  return res.json();
}

// ==================== NEWS ====================
export async function getNews() {
  const res = await fetch(`${API_BASE}/api/user/news`);
  return res.json();
}

// ==================== BANNERS ====================
export async function getBanners() {
  const res = await fetch(`${API_BASE}/api/user/banners`);
  return res.json();
}

// ==================== LIVE CHAT ====================
export async function getChatMessages() {
  return api("/chat");
}

export async function sendChatMessage(message) {
  return api("/chat", { method: "POST", body: { message } });
}

export async function getChatUnread() {
  return api("/chat/unread");
}
