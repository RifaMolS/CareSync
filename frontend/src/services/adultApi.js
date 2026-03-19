const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function fetchMedications({ adultId, childId } = {}) {
  const params = new URLSearchParams();
  if (adultId) params.append('adultId', adultId);
  if (childId) params.append('childId', childId);
  // Match route: router.get('/adult/medications', ...) mounted at /demo
  const url = `${BASE}/demo/adult/medications${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load meds: ${res.status}`);
  return res.json();
}

export async function markMedicationTaken(medicationId) {
  // Match route: router.post('/adult/log-medication', ...)
  const res = await fetch(`${BASE}/demo/adult/log-medication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicationId })
  });
  if (!res.ok) throw new Error('Failed to mark medication taken');
  return res.json();
}

export async function addMedication(payload) {
  // Match route: router.post('/adult/add-medication', ...)
  const res = await fetch(`${BASE}/demo/adult/add-medication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add medication');
  return res.json();
}

export async function submitMood({ adultId, mood, note }) {
  // Match route: router.post('/adult/mood', ...)
  const res = await fetch(`${BASE}/demo/adult/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adultId, mood, note })
  });
  if (!res.ok) throw new Error('Failed to submit mood');
  return res.json();
}

export async function fetchGamifiedData(adultId) {
  // Match route: router.post('/adult/gamified-data', ...)
  const res = await fetch(`${BASE}/demo/adult/gamified-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: adultId })
  });
  if (!res.ok) throw new Error('Failed to fetch gamified data');
  return res.json();
}

export async function fetchSchedule(age) {
  // Match route: router.post('/adult/schedule', ...)
  const res = await fetch(`${BASE}/demo/adult/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ age })
  });
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
}

export async function fetchMaterials() {
  // Match route: router.post('/adult/learning-materials', ...)
  const res = await fetch(`${BASE}/demo/adult/learning-materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error('Failed to fetch materials');
  return res.json();
}

export async function triggerEmergencyApi(adultId) {
  // Match route: router.post('/emergency/trigger', ...)
  const res = await fetch(`${BASE}/demo/emergency/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId: adultId, senderType: 'adult', location: 'Adult Dashboard', message: 'Adult requested help' })
  });
  if (!res.ok) throw new Error('Emergency request failed');
  return res.json();
}

export async function awardReward({ adultId, points, badge }) {
  const res = await fetch(`${BASE}/demo/adult/reward`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adultId, points, badge })
  });
  if (!res.ok) throw new Error('Failed to award reward');
  return res.json();
}