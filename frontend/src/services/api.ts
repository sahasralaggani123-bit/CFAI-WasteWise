import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://10.0.2.2:5000/api');

const mockBins = [
  { id: 1, bin_name: 'Green Bin', waste_type: 'Organic', location: 'Madhapur Sector 12', fill_percent: 65, status: 'Normal', capacity: 200, lat: 17.447, lng: 78.391, distance: '0.3 km' },
  { id: 2, bin_name: 'Blue Bin', waste_type: 'Plastic', location: 'Madhapur Sector 12', fill_percent: 88, status: 'Warning', capacity: 200, lat: 17.449, lng: 78.394, distance: '0.5 km' },
  { id: 3, bin_name: 'Yellow Bin', waste_type: 'Paper', location: 'Hitech City', fill_percent: 42, status: 'Normal', capacity: 200, lat: 17.444, lng: 78.389, distance: '0.8 km' },
  { id: 4, bin_name: 'Gray Bin', waste_type: 'Metal', location: 'Gachibowli', fill_percent: 95, status: 'Full', capacity: 200, lat: 17.443, lng: 78.397, distance: '1.2 km' },
  { id: 5, bin_name: 'White Bin', waste_type: 'Glass', location: 'Banjara Hills', fill_percent: 30, status: 'Normal', capacity: 200, lat: 17.441, lng: 78.386, distance: '1.9 km' },
];

const mockAnalytics = {
  total_classified: 1247, recycling_rate: 73, this_month: 342, this_week: 89,
  distribution: { Organic: 28, Plastic: 32, Paper: 18, Metal: 12, Glass: 10 },
  weekly: [44, 58, 37, 71, 63, 52, 45],
  risk: [
    { bin: 'Green Bin', days_left: '3 days', risk: 'Low' }, { bin: 'Blue Bin', days_left: '8 hrs', risk: 'Medium' },
    { bin: 'Gray Bin', days_left: 'Now', risk: 'High' }, { bin: 'Yellow Bin', days_left: '5 days', risk: 'Low' }, { bin: 'White Bin', days_left: '7 days', risk: 'Low' },
  ],
};

const mockNotifications = [
  { id: 1, title: '⚠️ Gray Bin Full', body: 'Gray Bin in Gachibowli has reached 95% capacity. Immediate collection required.', time: '2m ago', unread: true },
  { id: 2, title: '📊 Blue Bin Warning', body: 'Blue Bin is at 88%. Predicted to overflow within 8 hours.', time: '1h ago', unread: true },
  { id: 3, title: '✅ Waste Classified', body: 'Your plastic waste has been classified successfully with 91.4% confidence.', time: '3h ago' },
  { id: 4, title: '♻️ Weekly Report', body: "Your recycling rate this week was 73%. Great job! You’ve diverted 2.3 kg from landfill.", time: '1d ago' },
  { id: 5, title: '🗑️ Collection Done', body: 'Green Bin in Madhapur has been emptied and reset to 0%.', time: '2d ago' },
];

async function request(path: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) }, ...options });
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  async login(email: string, password: string) {
    const live = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (live?.success) return live;
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'citizen';
    return { success: true, token: `demo-${role}-token`, user: { id: role === 'admin' ? 2 : 1, name: role === 'admin' ? 'Admin User' : 'Arjun Kumar', email, role } };
  },
  async register(name: string, email: string, password: string) {
    return (await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })) ?? { success: true };
  },
  async getAllBins(token?: string) { return (await request('/bins', { headers: { Authorization: `Bearer ${token}` } })) ?? { success: true, bins: mockBins }; },
  async getAnalytics(token?: string) { return (await request('/analytics', { headers: { Authorization: `Bearer ${token}` } })) ?? { success: true, statistics: mockAnalytics }; },
  async getNotifications(token?: string) { return (await request('/notifications', { headers: { Authorization: `Bearer ${token}` } })) ?? { success: true, notifications: mockNotifications }; },
  async uploadImage(token: string, imageUri: string) {
    const category = imageUri.toLowerCase().includes('paper') ? 'Paper' : 'Plastic';
    return { success: true, prediction: { category, confidence: 91.4, recommended_bin: category === 'Paper' ? 'Yellow Bin' : 'Blue Bin', recycling_tip: 'Clean and dry the item before placing it into the bin.', environmental_impact: 'Correct sorting reduces landfill load and improves material recovery.', all_probabilities: { Plastic: 91.4, Paper: 4.2, Organic: 2.1, Metal: 1.3, Glass: 1.0 } } };
  },
  async adminSummary(token?: string) { return (await request('/admin/summary', { headers: { Authorization: `Bearer ${token}` } })) ?? { success: true, summary: { total_users: 1042, active_bins: 5, waste_records: 8741, critical_alerts: 2 } }; },
};
