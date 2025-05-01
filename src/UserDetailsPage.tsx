import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, Chip, Divider, IconButton,
  Stack, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

type Role   = 'DEVELOPER' | 'PROJECT_MANAGER' | 'GUEST';
type Status = 'AVAILABLE' | 'UNAVAILABLE';

interface User {
  id: number; name: string; surname: string; mail: string; phone: string;
  role: Role; status: Status; projectId: number | null; gorevId: number | null;
}

interface Project { id: number; projectName: string; }
interface Task    { id: number; task_name: string; status: string; }

const roleOpts = [
  { label: 'GELİŞTİRİCİ', value: 'DEVELOPER' },
  { label: 'PROJE YÖNETİCİSİ', value: 'PROJECT_MANAGER' },
  { label: 'MİSAFİR', value: 'GUEST' },
];
const statusOpts = [
  { label: 'BOŞTA', value: 'AVAILABLE' },
  { label: 'ÇALIŞIYOR', value: 'UNAVAILABLE' },
];

const UserDetailsPage: React.FC = () => {
  const { id } = useParams();            
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');


  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>('DEVELOPER');
  const [status, setStatus] = useState<Status>('AVAILABLE');

  useEffect(() => {
    const fetch = async () => {
      try {
        const uRes = await axios.get<User>(`/api/users/${id}`);
        const [projRes, taskRes] = await Promise.all([
          axios.get<Project[]>(`/api/projects/user/${id}`).catch(()=>({data:[]}))
          ,
          axios.get<Task[]>(`/api/tasks/user/${id}`).catch(()=>({data:[]}))
        ]);
        setUser(uRes.data);
        setRole(uRes.data.role); setStatus(uRes.data.status);
        setProjects(projRes.data); setTasks(taskRes.data);
      } catch (err:any) {
        setError(err.response?.data?.message || 'Veri alınamadı');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const saveUser = () => {
    if (!user) return;
    axios.put('/api/users', {
      ...user,
      role,
      status,
    })
    .then(res => { setUser(res.data); setOpen(false); })
    .catch(err => alert(err.response?.data?.message || 'Kaydedilemedi'));
  };

  if (loading) return <p>Yükleniyor…</p>;
  if (error || !user) return <p style={{color:'tomato'}}>{error || 'Kullanıcı bulunamadı'}</p>;

  return (
    <Box sx={{ p:4, maxWidth: 700, mx:'auto' }}>
      <Button startIcon={<ArrowBackIcon/>} onClick={()=>navigate(-1)} sx={{ mb:2 }}>
        Geri
      </Button>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{user.name} {user.surname}</Typography>
            <IconButton size="small" onClick={()=>setOpen(true)}>
              <EditIcon/>
            </IconButton>
          </Stack>

          <Typography sx={{ mt:1 }}>{user.mail}</Typography>
          <Typography>{user.phone}</Typography>

          <Divider sx={{ my:2 }}/>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2">Rol:</Typography>
            <Chip label={roleOpts.find(r=>r.value===user.role)?.label}/>
            <Typography variant="subtitle2" sx={{ ml:2 }}>Durum:</Typography>
            <Chip
              label={statusOpts.find(s=>s.value===user.status)?.label}
              color={user.status==='AVAILABLE' ? 'success':'error'}
            />
          </Stack>

          <Divider sx={{ my:3 }}/>
          <Typography variant="subtitle2">Atandığı Projeler</Typography>
          {projects.length
            ? projects.map(p=> <Typography key={p.id}>• {p.projectName}</Typography>)
            : <Typography color="text.secondary">Yok</Typography> }

          <Divider sx={{ my:3 }}/>
          <Typography variant="subtitle2">Atandığı Görevler</Typography>
          {tasks.length
            ? tasks.map(t=> (
                <Typography key={t.id}>• {t.task_name} <Chip size="small" label={t.status}/></Typography>
              ))
            : <Typography color="text.secondary">Yok</Typography>}
        </CardContent>
      </Card>

      {}
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt:1, minWidth:300 }}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select label="Rol" value={role}
                onChange={e=>setRole(e.target.value as Role)}>
                {roleOpts.map(o=>(
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select label="Durum" value={status}
                onChange={e=>setStatus(e.target.value as Status)}>
                {statusOpts.map(o=>(
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={saveUser}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetailsPage;
