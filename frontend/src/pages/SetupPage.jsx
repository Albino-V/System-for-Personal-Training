import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SetupPage() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [qrModal, setQrModal] = useState(null);
  const [adding, setAdding] = useState(false);

  const loadClients = () =>
    fetch('/api/clients').then((r) => r.json()).then(setClients);

  useEffect(() => { loadClients(); }, []);

  const addClient = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setAdding(true);
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', email: '', phone: '' });
    setAdding(false);
    loadClients();
  };

  const showQR = async (id) => {
    const data = await fetch(`/api/clients/${id}/qr`).then((r) => r.json());
    setQrModal(data);
  };

  const deleteClient = async (id) => {
    if (!confirm('Remove this client?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    loadClients();
  };

  return (
    <div className="page">
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="logo">🏋️</div>
            <h1>FitCheck</h1>
            <p>Personal Training Check-In System</p>
          </div>
          <Link to="/dashboard" className="btn btn-green">Dashboard →</Link>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2>Add Client</h2>
          <form onSubmit={addClient}>
            <label>Name *</label>
            <input
              placeholder="John Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Phone</label>
            <input
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <button type="submit" className="btn btn-green btn-full" disabled={adding}>
              {adding ? 'Adding...' : '+ Add Client'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Clients ({clients.length})</h2>
          {clients.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No clients yet. Add your first client above.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>{c.email || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-green"
                        style={{ padding: '5px 12px', fontSize: '0.8rem', marginRight: 6 }}
                        onClick={() => showQR(c.id)}
                      >
                        QR Code
                      </button>
                      <button
                        className="btn btn-red"
                        style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                        onClick={() => deleteClient(c.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>QR Code — {qrModal.client.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Print or share this QR code. Client scans with any camera.
            </p>
            <img src={qrModal.qr} alt="QR Code" />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', wordBreak: 'break-all', marginBottom: 16 }}>
              {qrModal.url}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <a
                href={qrModal.qr}
                download={`${qrModal.client.name.replace(' ', '_')}_qr.png`}
                className="btn btn-green"
              >
                Download PNG
              </a>
              <button className="btn btn-gray" onClick={() => setQrModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
