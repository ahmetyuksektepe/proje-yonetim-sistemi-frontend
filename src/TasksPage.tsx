import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, FormControl,
  InputLabel, Select, MenuItem,
} from '@mui/material';

import TaskCard, { TaskStatus } from './components/TaskCard';   

type Task = {
  id: number;
  task_name: string;
  task_description: string;
  status: TaskStatus;
  assignedProjectId: number | null;
  assignedUserId: number | null;
  projectName?: string | null;
  userName?: string | null;
};
type User = { id: number; name: string; surname: string };

const statusOptions = [
  { label: 'YAPILACAK', value: 'TODO' },
  { label: 'YAPIM AŞAMASINDA', value: 'IN_PROGRESS' },
  { label: 'İNCELEME', value: 'NEEDS_REVIEW' },
  { label: 'TAMAMLANDI', value: 'FINISHED' },
];

const TasksPage: React.FC = () => {
  const viewerRole = (localStorage.getItem('user_role') as 'PROJECT_MANAGER' | 'DEVELOPER' | 'GUEST') ?? 'GUEST';
  const canEdit   = viewerRole === 'PROJECT_MANAGER' || viewerRole === 'DEVELOPER';
  const canDelete = viewerRole === 'PROJECT_MANAGER';
  const devLimited = viewerRole === 'DEVELOPER';

  const [tasks,  setTasks]  = useState<Task[]>([]);
  const [users,  setUsers]  = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [curr, setCurr]         = useState<Task | null>(null);
  const [name, setName]         = useState('');
  const [desc, setDesc]         = useState('');
  const [status, setStatus]     = useState<TaskStatus>('TODO');
  const [user, setUser]         = useState<number|''>('');

  const [delOpen, setDelOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchAll = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          axios.get<Task[]>('/api/tasks'),
          axios.get<User[]>('/api/users'),
        ]);

        const enriched = await Promise.all(taskRes.data.map(async t => {
          const [projRes, usrRes] = await Promise.allSettled([
            t.assignedProjectId ? axios.get(`/api/projects/${t.assignedProjectId}`) : Promise.resolve(null),
            t.assignedUserId   ? axios.get(`/api/users/${t.assignedUserId}`)        : Promise.resolve(null),
          ]);
          return {
            ...t,
            projectName: projRes.status==='fulfilled' ? projRes.value?.data.projectName : null,
            userName:    usrRes.status==='fulfilled' ? usrRes.value?.data.name         : null,
          };
        }));

        setTasks(enriched);
        setUsers(userRes.data);
      } catch (err:any) {
        setError(err.response?.data?.message || 'Veriler alınamadı.');
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleEditClick = (t: Task) => {
    if (!canEdit) return;          
    setCurr(t);
    setName(t.task_name);
    setDesc(t.task_description);
    setStatus(t.status);
    setUser(t.assignedUserId || '');
    setEditOpen(true);
  };

  const saveTask = () => {
    if (!curr || !canEdit) return;

    axios.put('/api/tasks', {
      id: curr.id,
      task_name: name,
      task_description: desc,
      status,
      assignedProjectId: curr.assignedProjectId,
      assignedUserId: viewerRole === 'PROJECT_MANAGER' ? (user || null) : curr.assignedUserId,
    })
    .then(() => {
      setTasks(prev => prev.map(x =>
        x.id === curr.id
          ? { ...x, task_name: name, task_description: desc, status,
              assignedUserId: viewerRole === 'PROJECT_MANAGER' ? (user || null) : x.assignedUserId,
              userName: users.find(u => u.id === user)?.name || x.userName }
          : x
      ));
      setEditOpen(false);
    })
    .catch(err => alert(err.response?.data?.message || 'Kaydedilemedi'));
  };

  const handleDeleteClick = (t: Task) => {
    if (!canDelete) return;     
    setCurr(t);
    setDelOpen(true);
  };

  const confirmDelete = () => {
    if (!curr || !canDelete) return;
    axios.delete(`/api/tasks/${curr.id}`)
      .then(() => {
        setTasks(prev => prev.filter(x => x.id !== curr.id));
        setDelOpen(false);
      })
      .catch(err => alert(err.response?.data?.message || 'Silinemedi'));
  };

  return (
    <main className="main-container">
      <div className="main-title"><h3>GÖREVLER</h3></div>

      <div className="charts">
        {loading && <p>Yükleniyor…</p>}
        {error   && <p style={{ color:'tomato' }}>{error}</p>}

        {!loading && !error && tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            projectName={t.projectName}
            userName={t.userName}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Görevi Düzenle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt:1, minWidth:320 }}>
            <TextField
              label="Görev Adı"
              fullWidth
              value={name}
              onChange={e=>setName(e.target.value)}
              disabled={devLimited}          
            />
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              minRows={3}
              value={desc}
              onChange={e=>setDesc(e.target.value)}
            />
            <FormControl fullWidth disabled={!canEdit}>
              <InputLabel>Durum</InputLabel>
              <Select label="Durum" value={status}
                onChange={e=>setStatus(e.target.value as TaskStatus)}>
                {statusOptions.map(o=>(
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {viewerRole === 'PROJECT_MANAGER' && (
              <FormControl fullWidth>
                <InputLabel>Kullanıcı</InputLabel>
                <Select label="Kullanıcı" value={user}
                  onChange={e=>setUser(e.target.value as any)}>
                  <MenuItem value="">Boş</MenuItem>
                  {users.map(u=>(
                    <MenuItem key={u.id} value={u.id}>{u.name} {u.surname}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={saveTask} disabled={!canEdit}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Emin misiniz?</DialogTitle>
        <DialogContent dividers>
          {curr?.task_name} adlı görev silinecek.
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDelOpen(false)}>Hayır</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={!canDelete}>
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default TasksPage;
