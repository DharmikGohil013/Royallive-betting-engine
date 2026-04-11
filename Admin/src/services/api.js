const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://45.77.168.91:4000");

function getToken() {
  return sessionStorage.getItem("gain-live-admin-token") || "";
}

function setToken(token) {
  sessionStorage.setItem("gain-live-admin-token", token);
}

function clearAuth() {
  sessionStorage.removeItem("gain-live-admin-token");
  sessionStorage.removeItem("gain-live-admin-auth");
}

async function api(path, options = {}) {
  const { method = "GET", body, params } = options;
  let url = `${API_BASE}/api${path}`;

  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ==================== AUTH ====================
export async function adminLogin(username, password) {
  const data = await api("/admin/login", { method: "POST", body: { username, password } });
  if (data.token) {
    setToken(data.token);
    sessionStorage.setItem("gain-live-admin-auth", "true");
  }
  return data;
}

export async function adminVerify() {
  return api("/admin/verify");
}

export function adminLogout() {
  clearAuth();
}

// ==================== DASHBOARD ====================
export async function getDashboardStats() {
  return api("/admin/dashboard/stats");
}

// ==================== USERS ====================
export async function getUsers(params = {}) {
  return api("/admin/users", { params });
}

export async function getUserById(id) {
  return api(`/admin/users/${id}`);
}

export async function updateUserStatus(id, status) {
  return api(`/admin/users/${id}/status`, { method: "PATCH", body: { status } });
}

export async function updateUserBalance(id, amount, type, note) {
  return api(`/admin/users/${id}/balance`, { method: "PATCH", body: { amount, type, note } });
}

// ==================== TRANSACTIONS ====================
export async function getTransactions(params = {}) {
  return api("/admin/transactions", { params });
}

export async function updateTransactionStatus(id, status) {
  return api(`/admin/transactions/${id}/status`, { method: "PATCH", body: { status } });
}

// ==================== GAMES ====================
export async function getGames() {
  return api("/admin/games");
}

export async function createGame(gameData) {
  return api("/admin/games", { method: "POST", body: gameData });
}

export async function updateGame(id, gameData) {
  return api(`/admin/games/${id}`, { method: "PUT", body: gameData });
}

export async function deleteGame(id) {
  return api(`/admin/games/${id}`, { method: "DELETE" });
}

// ==================== NOTIFICATIONS ====================
export async function getNotifications(params = {}) {
  return api("/admin/notifications", { params });
}

export async function createNotification(data) {
  return api("/admin/notifications", { method: "POST", body: data });
}

export async function deleteNotification(id) {
  return api(`/admin/notifications/${id}`, { method: "DELETE" });
}

// ==================== PAYMENT METHODS ====================
export async function getPaymentMethods() {
  return api("/admin/payment-methods");
}

export async function createPaymentMethod(data) {
  return api("/admin/payment-methods", { method: "POST", body: data });
}

export async function updatePaymentMethod(id, data) {
  return api(`/admin/payment-methods/${id}`, { method: "PUT", body: data });
}

export async function deletePaymentMethod(id) {
  return api(`/admin/payment-methods/${id}`, { method: "DELETE" });
}

// ==================== SETTINGS ====================
export async function getSettings(category) {
  return api("/admin/settings", { params: category ? { category } : {} });
}

export async function updateSetting(key, value, category, description) {
  return api("/admin/settings", { method: "PUT", body: { key, value, category, description } });
}

// ==================== CRICKET ====================
export async function getCricketMatches(params = {}) {
  return api("/admin/cricket", { params });
}

export async function createCricketMatch(data) {
  return api("/admin/cricket", { method: "POST", body: data });
}

export async function updateCricketMatch(id, data) {
  return api(`/admin/cricket/${id}`, { method: "PUT", body: data });
}

export async function deleteCricketMatch(id) {
  return api(`/admin/cricket/${id}`, { method: "DELETE" });
}

// ==================== BETS ====================
export async function getBets(params = {}) {
  return api("/admin/bets", { params });
}

export async function settleBet(id, result) {
  return api(`/admin/bets/${id}/settle`, { method: "PATCH", body: { result } });
}

// ==================== ACTIVITY LOGS ====================
export async function getActivityLogs(params = {}) {
  return api("/admin/activity-logs", { params });
}

// ==================== ANALYTICS ====================
export async function getAnalyticsOverview() {
  return api("/analytics/overview");
}

export async function getUserGrowth() {
  return api("/analytics/user-growth");
}

export async function getWeeklyTransactions() {
  return api("/analytics/weekly-transactions");
}

export async function getMonthlyProfit() {
  return api("/analytics/monthly-profit");
}

export async function getRevenueByGame() {
  return api("/analytics/revenue-by-game");
}

export async function getTopUsers(metric, limit) {
  return api("/analytics/top-users", { params: { metric, limit } });
}

export async function getBetAnalysis() {
  return api("/analytics/bet-analysis");
}

export async function getAlerts() {
  return api("/analytics/alerts");
}

export async function getGameStats() {
  return api("/analytics/game-stats");
}

export async function getHourlyActivity() {
  return api("/analytics/hourly-activity");
}

export async function getUserRetention() {
  return api("/analytics/user-retention");
}

export async function getPlatformSummary() {
  return api("/analytics/summary");
}
