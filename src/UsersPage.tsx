// src/pages/UsersPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './components/UserCard';     // yolu proje yapına göre düzelt

type User = {
  id: number;
  name: string;
  surname: string;
  mail: string;
  phone: string;
  role: 'DEVELOPER' | 'PROJECT_MANAGER' | 'GUEST';
  status: 'AVAILABLE' | 'UNAVAILABLE';
  projectId: number | null;
  gorevId: number | null;
};

type EnrichedUser = User & {
  projectName: string | null;
  taskName: string | null;
};

const UsersPage: React.FC = () => {
  const [users, setUsers]   = useState<EnrichedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios
      .get<User[]>('/api/users')
      .then(async (res) => {
        /* Her kullanıcı için proje + görev adlarını paralel çek */
        const enriched = await Promise.all(
          res.data.map(async (u) => {
            const [projRes, taskRes] = await Promise.allSettled([
              u.projectId ? axios.get(`/api/projects/${u.projectId}`) : Promise.resolve(null),
              u.gorevId   ? axios.get(`/api/tasks/${u.gorevId}`)     : Promise.resolve(null),
            ]);

            return {
              ...u,
              projectName:
                projRes.status === 'fulfilled'
                  ? projRes.value?.data?.projectName || null
                  : null,
              taskName:
                taskRes.status === 'fulfilled'
                  ? taskRes.value?.data?.task_name || null
                  : null,
            };
          })
        );
        setUsers(enriched);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || 'Kullanıcılar getirilirken bir hata oluştu.'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>ÇALIŞANLAR</h3>
      </div>

      <div className="charts">
        {loading && <p>Yükleniyor…</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        {!loading &&
          !error &&
          users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              projectName={u.projectName}
              taskName={u.taskName}
              onEdit={(user) => console.log('Düzenle', user)}
            />
          ))}
      </div>
    </main>
  );
};

export default UsersPage;
