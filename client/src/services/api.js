const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  if (!entries.length) return "";
  const query = new URLSearchParams(entries).toString();
  return `?${query}`;
};

const request = async (path, { method = "GET", body, token, params } = {}) => {
  const url = `${API_BASE_URL}${path}${buildQuery(params)}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.error?.message || "Request failed";
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, options) => request(path, { ...options, method: "POST" }),
  patch: (path, options) => request(path, { ...options, method: "PATCH" }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" })
};
