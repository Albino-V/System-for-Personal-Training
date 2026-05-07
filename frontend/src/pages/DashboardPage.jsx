import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  const fetchDay = (date) => {
    setLoading(true);
    fetch(`/api/checkins?date=${date}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  };

  useEffect(() => {
    fetchDay(selectedDate);
    fetch('/api/checkins/history')
      .then((r) => r.json())
      .then(setHistory);
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchDay(e.target.value);
  };

  return (
    <div className="page">
      <div style={{ width: '100%', maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="logo">🏋️</div>
            <h1>Trainer Dashboard</h1>
          </div>
          <Link to="/" className="btn btn-gray">Manage Clients</Link>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{ marginBottom: 0, width: 'auto' }}
              />
            </div>
            <div style={{ marginTop: 4 }}>
              <span className="badge badge-green">
                {loading ? '...' : data?.count} check-ins
              </span>
            </div>
            <button
              className="btn btn-green"
              style={{ marginLeft: 'auto' }}
              onClick={() => fetchDay(selectedDate)}
            >
              Refresh ↻
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2>Attendance — {selectedDate}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : data?.checkins.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No check-ins for this date.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.checkins.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>{c.name}</strong>
                      {c.email && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.email}</div>}
                    </td>
                    <td>
                      {new Date(c.checked_in_at).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {history.length > 0 && (
          <div className="card">
            <h2>Last 30 Days</h2>
            <table>
              <thead>
                <tr><th>Date</th><th>Total Check-ins</th></tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.day}>
                    <td
                      style={{ cursor: 'pointer', color: '#16a34a', textDecoration: 'underline' }}
                      onClick={() => { setSelectedDate(h.day); fetchDay(h.day); }}
                    >
                      {h.day}
                    </td>
                    <td>{h.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
