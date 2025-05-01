// src/pages/TasksPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './components/TaskCard';

type Task = {
  id: number;
  task_name: string;
  task_description: string;
  status: string;
  assignedProjectId: number | null;
  assignedUserId: number | null;
};

type EnrichedTask = Task & {
  projectName: string | null;
  userName: string | null;
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks]   = useState<EnrichedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios
      .get<Task[]>('/api/tasks')
      .then(async (res) => {
        // Paralel olarak proje + kullanıcı adlarını getir
        const enriched = await Promise.all(
          res.data.map(async (t) => {
            const [projectRes, userRes] = await Promise.allSettled([
              t.assignedProjectId
                ? axios.get(`/api/projects/${t.assignedProjectId}`)
                : Promise.resolve(null),
              t.assignedUserId
                ? axios.get(`/api/users/${t.assignedUserId}`)
                : Promise.resolve(null),
            ]);

            return {
              ...t,
              projectName:
                projectRes.status === 'fulfilled'
                  ? projectRes.value?.data?.projectName || null
                  : null,
              userName:
                userRes.status === 'fulfilled' && userRes.value ? userRes.value.data.name : null,
            };
          })
        );
        setTasks(enriched);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || 'Görevler getirilirken bir hata oluştu.'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>GÖREVLER</h3>
      </div>

      <div className="charts"> {/* Aynı stil grubunu kullanıyoruz */}
        {loading && <p>Yükleniyor…</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        {!loading &&
          !error &&
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              projectName={t.projectName}
              userName={t.userName}
              onEdit={(task) => console.log('Düzenle', task)}
            />
          ))}
      </div>
    </main>
  );
};

export default TasksPage;
