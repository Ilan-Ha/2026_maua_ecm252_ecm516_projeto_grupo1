import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const API =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:10000'
    : 'http://127.0.0.1:10000';

const SERVICES = [
  'auth',
  'user',
  'catalog',
  'review',
  'history',
  'gateway',
  'event-bus',
  'request-bus',
  'logs',
];

function formatTs(value) {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function highlight(text, q) {
  if (!q || !text) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function App() {
  const [service, setService] = useState('gateway');
  const [level, setLevel] = useState('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const searchRef = useRef(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '150', service });
      if (level) params.set('level', level);
      if (q.trim()) params.set('q', q.trim());
      const res = await fetch(`${API}/logs?${params}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : data.error || 'Falha ao carregar logs',
        );
      }
      const list = data.content?.items || data.items || [];
      setItems(list);
      setSelected((prev) => {
        if (!prev) return list[0] || null;
        return list.find((x) => x._id === prev._id) || list[0] || null;
      });
    } catch (err) {
      setError(err.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  }, [service, level, q]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const id = setInterval(fetchLogs, 4000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchLogs]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const detailJson = useMemo(() => {
    if (!selected) return '';
    return JSON.stringify(selected, null, 2);
  }, [selected]);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>
            <span className={`status-dot ${error ? 'off' : ''}`} />
            AllForOne · Logs Console
          </h1>
          <div className="hint">localhost only · Ctrl/Cmd+F busca · poll 4s</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            auto-refresh
          </label>
          <button type="button" onClick={fetchLogs} disabled={loading}>
            {loading ? '…' : 'Refresh'}
          </button>
        </div>
      </header>

      <nav className="tabs">
        {SERVICES.map((name) => (
          <button
            key={name}
            type="button"
            className={`tab ${service === name ? 'active' : ''}`}
            onClick={() => setService(name)}
          >
            {name}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        <input
          ref={searchRef}
          type="search"
          placeholder="Buscar na mensagem (Ctrl/Cmd+F)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">todos os levels</option>
          <option value="error">error</option>
          <option value="warn">warn</option>
          <option value="info">info</option>
          <option value="debug">debug</option>
        </select>
        {error && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</span>}
        <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
          {items.length} eventos
        </span>
      </div>

      <div className="main">
        <section className="list">
          {items.length === 0 ? (
            <div className="empty">Nenhum log para `{service}`.</div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className={`row ${selected?._id === item._id ? 'selected' : ''}`}
                onClick={() => setSelected(item)}
              >
                <span className="ts">{formatTs(item.createdAt)}</span>
                <span className={`badge ${item.level}`}>{item.level}</span>
                <span className="kind">{item.kind}</span>
                <span className="msg">{highlight(item.message, q)}</span>
              </div>
            ))
          )}
        </section>

        <aside className="detail">
          {selected ? (
            <>
              <h2>Detalhe</h2>
              <pre>{detailJson}</pre>
            </>
          ) : (
            <div className="empty">Selecione um log/evento.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
