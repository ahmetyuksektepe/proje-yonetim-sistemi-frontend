// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsPeopleFill,
} from 'react-icons/bs';

import ProjectCard from './components/ProjectCard';   // yolu kendine göre düzelt

type Project = {
  id: number;
  projectName: string;
  projectDate: string;   // ISO string
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    // token varsa ekle
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    axios
      .get<Project[]>('/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            'Projeler getirilirken bir hata oluştu.'
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>ANA MENÜ</h3>
      </div>

      {/* ───────────── ÖNCEKİ CHART ALANI ───────────── */}
      <div className="charts">
        {loading && <p>Yükleniyor…</p>}

        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        {!loading &&
          !error &&
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              title={p.projectName}
              subtitle={new Date(p.projectDate).toLocaleDateString('tr-TR')}
            />
          ))}
      </div>
    </main>
  );
};

export default ProjectsPage;
