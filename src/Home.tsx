// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsPeopleFill,
} from 'react-icons/bs';

const Home: React.FC = () => {
  const [projCount, setProjCount]   = useState<number | null>(null);
  const [taskCount, setTaskCount]   = useState<number | null>(null);
  const [userCount, setUserCount]   = useState<number | null>(null);
  const [error, setError]           = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    Promise.allSettled([
      axios.get('/api/projects'),
      axios.get('/api/tasks'),
      axios.get('/api/users'),
    ])
      .then(([projRes, taskRes, userRes]) => {
        if (projRes.status === 'fulfilled') setProjCount(projRes.value.data.length);
        if (taskRes.status === 'fulfilled') setTaskCount(taskRes.value.data.length);
        if (userRes.status === 'fulfilled') setUserCount(userRes.value.data.length);

        // Hata yakala ama sayfa kısmen çalışmaya devam etsin
        [projRes, taskRes, userRes].forEach((res) => {
          if (res.status === 'rejected') {
            console.error(res.reason);
            setError('Veriler tam alınamadı.');
          }
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Sayım yapılırken bir hata oluştu.');
      });
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>ANA MENÜ</h3>
      </div>

      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>PROJELER</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{projCount ?? '...'}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>GÖREVLER</h3>
            <BsListCheck className="card_icon" />
          </div>
          <h1>{taskCount ?? '...'}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>ÇALIŞANLAR</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{userCount ?? '...'}</h1>
        </div>
      </div>
    </main>
  );
};

export default Home;
