// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import ProjectCard from './components/ProjectCard';

type Project = {
  id: number;
  projectName: string;
  projectDate: string;
};

type User = {
  id: number;
  name: string;
  surname: string;
};

const statusOptions = [
  { label: 'YAPILACAK',        value: 'TODO' },
  { label: 'YAPIM AŞAMASINDA', value: 'IN_PROGRESS' },
  { label: 'İNCELEME GEREKİYOR', value: 'NEEDS_REVIEW' },
  { label: 'TAMAMLANDI',       value: 'FINISHED' },
];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  /* Düzenle pop-up */
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent]   = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');

  /* Sil pop-up */
  const [delOpen, setDelOpen] = useState(false);

  /* Görev ekle pop-up */
  const [addOpen, setAddOpen]        = useState(false);
  const [taskName, setTaskName]      = useState('');
  const [taskDesc, setTaskDesc]      = useState('');
  const [taskStatus, setTaskStatus]  = useState('TODO');
  const [taskUser, setTaskUser]      = useState<number | ''>('');
  const [users, setUsers]            = useState<User[]>([]);
  const [addProject, setAddProject]  = useState<Project | null>(null);

  /* Projeleri getir */
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get<Project[]>('/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Projeler getirilirken hata oluştu.'))
      .finally(() => setLoading(false));
  }, []);

  /* — Düzenle — */
  const handleEditClick = (p: Project) => {
    setCurrent(p);
    setEditName(p.projectName);
    setEditDate(p.projectDate);
    setEditOpen(true);
  };
  const handleSave = () => {
    if (!current) return;
    axios.put('/api/projects', { id: current.id, projectName: editName, projectDate: editDate })
      .then(() => {
        setProjects((prev) =>
          prev.map((pr) => pr.id === current.id ? { ...pr, projectName: editName, projectDate: editDate } : pr)
        );
        setEditOpen(false);
      })
      .catch((err) => alert(err.response?.data?.message || 'Güncelleme başarısız'));
  };

  /* — Sil — */
  const handleDeleteClick = (p: Project) => { setCurrent(p); setDelOpen(true); };
  const confirmDelete = () => {
    if (!current) return;
    axios.delete(`/api/projects/${current.id}`)
      .then(() => { setProjects((prev) => prev.filter((pr) => pr.id !== current.id)); setDelOpen(false); })
      .catch((err) => alert(err.response?.data?.message || 'Silinemedi'));
  };

  /* — Görev ekle — */
  const handleAddClick = (p: Project) => {
    setAddProject(p);
    setTaskName(''); setTaskDesc(''); setTaskStatus('TODO'); setTaskUser('');
    setAddOpen(true);

    /* Kullanıcı listesi lazy-load */
    if (users.length === 0) {
      axios.get<User[]>('/api/users')
        .then((res) => setUsers(res.data))
        .catch(() => {/* hata sessiz geç */});
    }
  };

  const saveTask = () => {
    if (!addProject) return;
    axios.post('/api/tasks', {
      task_name: taskName,
      task_description: taskDesc,
      status: taskStatus,
      assignedProjectId: addProject.id,
      assignedUserId: taskUser || null,
    })
      .then(() => setAddOpen(false))
      .catch((err) => alert(err.response?.data?.message || 'Görev eklenemedi'));
  };

  return (
    <main className="main-container">
      <div className="main-title"><h3>PROJELER</h3></div>

      <div className="charts">
        {loading && <p>Yükleniyor…</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        {!loading && !error && projects.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.projectName}
            subtitle={new Date(p.projectDate).toLocaleDateString('tr-TR')}
            onAdd={()   => handleAddClick(p)}
            onEdit={()  => handleEditClick(p)}
            onDelete={() => handleDeleteClick(p)}
          />
        ))}
      </div>

      {/* Düzenle */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Projeyi Düzenle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <TextField label="Proje Adı" fullWidth value={editName}
              onChange={(e) => setEditName(e.target.value)} />
            <TextField label="Proje Tarihi" type="date" InputLabelProps={{ shrink: true }}
              value={editDate} onChange={(e) => setEditDate(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={handleSave}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Sil */}
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Emin misiniz?</DialogTitle>
        <DialogContent dividers>{current?.projectName} silinecek.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Hayır</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Evet, Sil</Button>
        </DialogActions>
      </Dialog>

      {/* Görev Ekle */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>{addProject?.projectName} → Görev Ekle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField label="Görev Adı" fullWidth value={taskName}
              onChange={(e) => setTaskName(e.target.value)} />
            <TextField label="Açıklama" fullWidth multiline minRows={3}
              value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />

            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select label="Durum" value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as string)}>
                {statusOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Atanan Kullanıcı</InputLabel>
              <Select label="Atanan Kullanıcı" value={taskUser}
                onChange={(e) => setTaskUser(e.target.value as number | '')}>
                <MenuItem value="">Boş</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} {u.surname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={saveTask}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default ProjectsPage;
