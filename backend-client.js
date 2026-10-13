(() => {
  const API = 'http://127.0.0.1:4174/api';
  const pending = new Map();
  const timers = new Map();
  let available = false;
  let status = { online: false, openaiConfigured: false, model: null };

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(value.message || value.error || `后端请求失败 (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return value;
  }

  async function check() {
    try {
      const value = await request('/health');
      available = true;
      status = { online: true, openaiConfigured: Boolean(value.openaiConfigured), modelConfigured: Boolean(value.modelConfigured), model: value.model || null };
    } catch {
      available = false;
      status = { online: false, openaiConfigured: false, modelConfigured: false, model: null };
    }
    window.dispatchEvent(new CustomEvent('society:backend-status', { detail: status }));
    return status;
  }

  async function listTowns() {
    if (!available && !(await check()).online) return [];
    try { return (await request('/towns')).towns || []; } catch { return []; }
  }

  async function getTown(id) {
    if (!id || (!available && !(await check()).online)) return null;
    try { return await request(`/towns/${encodeURIComponent(id)}`); }
    catch (error) { if (error.status === 404) return null; return null; }
  }

  async function createTown(name, state) {
    if (!available && !(await check()).online) throw new Error('后端未启动。');
    return request('/towns', { method: 'POST', body: JSON.stringify({ name, state }) });
  }

  async function generateWorld(options = {}) {
    if (!available && !(await check()).online) throw new Error('本机后端未启动。');
    return request('/worlds/generate', { method: 'POST', body: JSON.stringify(options) });
  }

  async function decideAgentAction(options = {}) {
    if (!available && !(await check()).online) throw new Error('本机后端未启动。');
    return request('/agents/decide', { method: 'POST', body: JSON.stringify(options) });
  }

  async function flush(id) {
    const latest = pending.get(id);
    if (!latest || !available) return;
    pending.delete(id);
    try {
      await request(`/towns/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ name: latest.worldName || '榆灯镇', state: latest }) });
    } catch (error) {
      if (!error.status) available = false;
    }
  }

  function saveTown(id, state) {
    if (!id || !state) return;
    pending.set(id, state);
    clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => flush(id), 260));
  }

  window.SocietyBackend = {
    check,
    getTown,
    listTowns,
    createTown,
    generateWorld,
    decideAgentAction,
    saveTown,
    isOnline: () => available,
    getStatus: () => ({ ...status }),
  };
  check();
})();
