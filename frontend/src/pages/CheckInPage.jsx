import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CheckInPage() {
  const { clientId } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error | already
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/checkins/${clientId}`, { method: 'POST' })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          setData(json);
          setStatus('success');
        } else {
          setStatus('error');
          setData(json);
        }
      })
      .catch(() => setStatus('error'));
  }, [clientId]);

  if (status === 'loading') {
    return (
      <div className="page" style={{ justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="logo">⏳</div>
          <h1>Checking in...</h1>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    const time = new Date(data.checked_in_at).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
    return (
      <div className="page" style={{ justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="success-icon">✅</div>
          <h1 style={{ color: '#166534' }}>You're checked in!</h1>
          <p style={{ fontSize: '1.2rem', marginTop: 8, marginBottom: 16 }}>
            Welcome, <strong>{data.client_name}</strong>!
          </p>
          <p style={{ color: '#6b7280' }}>Logged at {time}</p>
          <p style={{ marginTop: 16, color: '#6b7280', fontSize: '0.9rem' }}>
            Your attendance has been recorded. Have a great workout! 💪
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="error-icon">❌</div>
        <h1 style={{ color: '#dc2626' }}>Check-in failed</h1>
        <p style={{ marginTop: 8 }}>{data?.error || 'Something went wrong. Please try again.'}</p>
      </div>
    </div>
  );
}
