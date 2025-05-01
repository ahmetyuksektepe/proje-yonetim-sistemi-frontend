import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

import UserCard from './components/UserCard';

type Role   = 'DEVELOPER' | 'PROJECT_MANAGER' | 'GUEST';
type Status = 'AVAILABLE' | 'UNAVAILABLE';

type User = {
  id: number;
  name: string;
  surname: string;
  mail: string;
  phone: string;
  role: Role;
  status: Status;
  projectId: number | null;
  gorevId:   number | null;
  taskName?: string | null;      
};

const roleOptions = [
  { label: 'GELİŞTİRİCİ',       value: 'DEVELOPER' },
  { label: 'PROJE YÖNETİCİSİ',  value: 'PROJECT_MANAGER' },
  { label: 'MİSAFİR',           value: 'GUEST' },
];

const statusOptions = [
  { label: 'BOŞTA',     value: 'AVAILABLE' },
  { label: 'ÇALIŞIYOR', value: 'UNAVAILABLE' },
];

const UsersPage: React.FC = () => {
  const [users,  setUsers]  = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [curr, setCurr]         = useState<User | null>(null);
  const [role, setRole]         = useState<Role>('DEVELOPER');
  const [status, setStatus]     = useState<Status>('AVAILABLE');

  const [delOpen, setDelOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchAll = async () => {
      try {
        const [uRes, tRes] = await Promise.all([
          axios.get<User[]>('/api/users'),
          axios.get<{ id:number; task_name:string }[]>('/api/tasks'),
        ]);

        const enriched = uRes.data.map(u => ({
          ...u,
          taskName: tRes.data.find(t => t.id === u.gorevId)?.task_name || null,
        }));

        setUsers(enriched);
      } catch (err:any) {
        setError(err.response?.data?.message || 'Veriler alınamadı.');
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleEditClick = (u: User) => {
    setCurr(u);
    setRole(u.role);
    setStatus(u.status);
    setEditOpen(true);
  };

  const saveUser = () => {
    if (!curr) return;

    axios.put('/api/users', {
      id: curr.id,
      name: curr.name,
      surname: curr.surname,
      mail: curr.mail,
      phone: curr.phone,
      projectId: curr.projectId,
      gorevId:   curr.gorevId,

      role,
      status,
    })
    .then(res => {
      const updated = res.data as User;
      setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, role:updated.role, status:updated.status } : u));
      setEditOpen(false);
    })
    .catch(err => alert(err.response?.data?.message || 'Kaydedilemedi'));
  };

  const handleDeleteClick = (u: User) => { setCurr(u); setDelOpen(true); };
  const confirmDelete = () => {
    if (!curr) return;
    axios.delete(`/api/users/${curr.id}`)
      .then(() => { setUsers(prev => prev.filter(x => x.id !== curr.id)); setDelOpen(false); })
      .catch(err => alert(err.response?.data?.message || 'Silinemedi'));
  };

  return (
    <main className="main-container">
      <div className="main-title"><h3>ÇALIŞANLAR</h3></div>

      <div className="charts">
        {loading && <p>Yükleniyor…</p>}
        {error   && <p style={{ color:'tomato' }}>{error}</p>}

        {!loading && !error && users.map(u=>(
          <UserCard
            key={u.id}
            user={u}
            taskName={u.taskName}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {}
      <Dialog open={editOpen} onClose={()=>setEditOpen(false)}>
        <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt:1, minWidth:320 }}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select label="Rol" value={role}
                onChange={e=>setRole(e.target.value as Role)}>
                {roleOptions.map(o=>(
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select label="Durum" value={status}
                onChange={e=>setStatus(e.target.value as Status)}>
                {statusOptions.map(o=>(
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={saveUser}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog open={delOpen} onClose={()=>setDelOpen(false)}>
        <DialogTitle>Emin misiniz?</DialogTitle>
        <DialogContent dividers>
          {curr?.name} {curr?.surname} silinecek.
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDelOpen(false)}>Hayır</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Evet, Sil</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default UsersPage;
