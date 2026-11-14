const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Request failed");
    return res.status === 204 ? null : res.json();
}

export const getFarms = () => request("/farms");

// returns { referenceCode }
export const submitRegistration = (data) =>
    request("/registrations", { method: "POST", body: JSON.stringify(data) });

export const saveContactPreferences = (referenceCode, prefs) =>
    request(`/registrations/${referenceCode}/contact`, { method: "PATCH", body: JSON.stringify(prefs) });

export const submitFeedback = (data) =>
    request("/feedback", { method: "POST", body: JSON.stringify(data) });

// sends { fullName, email, topic, message }
export const submitInquiry = (data) =>
    request("/inquiries", { method: "POST", body: JSON.stringify(data) });

export const getPrediction = (params) => request(`/predictions?${new URLSearchParams(params)}`);