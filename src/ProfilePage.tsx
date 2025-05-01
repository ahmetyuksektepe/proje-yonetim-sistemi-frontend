import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';

/* ---------- Tipler ---------- */
type Role   = 'DEVELOPER' | 'PROJECT_MANAGER' | 'GUEST';
type Status = 'AVAILABLE' | 'UNAVAILABLE';
interface User {
  id:number; name:string; surname:string; mail:string; phone:string;
  role:Role; status:Status;
}
interface Task { id:number; task_name:string; status:string; assignedUserId:number }

/* ---------- Sabit seçenekler ---------- */
const roleOpts = [
  { label: 'GELİŞTİRİCİ',       value: 'DEVELOPER' },
  { label: 'PROJE YÖNETİCİSİ',  value: 'PROJECT_MANAGER' },
  { label: 'MİSAFİR',           value: 'GUEST' },
];
const statusOpts = [
  { label: 'BOŞTA',     value: 'AVAILABLE' },
  { label: 'ÇALIŞIYOR', value: 'UNAVAILABLE' },
];

/* ---------- Yardımcı ---------- */
const getLoggedUserId = (): number | null => {
  const idStr = localStorage.getItem('user_id');
  return idStr ? Number(idStr) : null;
};

/* ---------- Stil ---------- */
const PageContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));
const InfoCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  padding: theme.spacing(4),
  boxShadow:
    theme.palette.mode === 'dark'
      ? 'hsla(220,30%,5%,.4) 0 4px 12px'
      : 'hsla(220,30%,5%,.1) 0 4px 12px',
}));

/* =================================================================== */
const ProfilePage: React.FC = () => {
  const userId = getLoggedUserId();
  const viewerRole: Role = (localStorage.getItem('user_role') as Role) ?? 'GUEST';

  /* izinler */
  const canOpenDialog   = viewerRole === 'PROJECT_MANAGER' || viewerRole === 'DEVELOPER';
  const canChangeRole   = viewerRole === 'PROJECT_MANAGER';
  const canChangeStatus = viewerRole !== 'GUEST';

  /* state’ler */
  const [user,  setUser]  = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  /* edit popup */
  const [open,   setOpen]   = useState(false);
  const [role,   setRole]   = useState<Role>('DEVELOPER');
  const [status, setStatus] = useState<Status>('AVAILABLE');

  /* -------- Veri çekimi -------- */
  useEffect(() => {
    if (!userId) { setError('Kullanıcı bulunamadı'); setLoading(false); return; }

    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    Promise.all([
      axios.get<User>(`/api/users/${userId}`),
      axios.get<Task[]>('/api/tasks'),
    ])
    .then(([uRes, tRes]) => {
      setUser(uRes.data);
      setRole(uRes.data.role);
      setStatus(uRes.data.status);
      setTasks(tRes.data.filter(t => t.assignedUserId === userId));
    })
    .catch(e => setError(e.response?.data?.message || 'Veri alınamadı'))
    .finally(() => setLoading(false));
  }, [userId]);

  /* -------- Kaydet -------- */
  const save = () => {
    if (!user) return;

    /* only allowed fields */
    const payload: Partial<User> = { id: user.id };
    if (canChangeRole)   payload.role   = role;
    if (canChangeStatus) payload.status = status;

    axios.put('/api/users', { ...user, ...payload })
      .then(res => {
        const updated = res.data && Object.keys(res.data).length
          ? (res.data as User)
          : { ...user, ...payload };

        setUser(updated);
        setRole(updated.role);
        setStatus(updated.status);
        setOpen(false);
      })
      .catch(e => alert(e.response?.data?.message || 'Kaydedilemedi'));
  };

  /* -------- JSX -------- */
  if (loading) return <p>Yükleniyor…</p>;
  if (error || !user) return <p style={{ color:'tomato' }}>{error || 'Hata'}</p>;

  return (
    <PageContainer>
      <InfoCard variant="outlined">
        <Stack alignItems="center" spacing={2}>
          <AccountCircleIcon sx={{ fontSize: 56 }} />
          <Typography variant="h4" fontWeight={600}>Profilim</Typography>
        </Stack>

        <CardContent sx={{ px: 0 }}>
          <Stack spacing={1.5}>
            <Typography><b>Ad Soyad:</b> {user.name} {user.surname}</Typography>
            <Typography><b>Email:</b> {user.mail}</Typography>
            <Typography><b>Telefon:</b> {user.phone}</Typography>

            {canOpenDialog && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={roleOpts.find(r => r.value === user.role)?.label} />
                <Chip
                  label={statusOpts.find(s => s.value === user.status)?.label}
                  color={user.status === 'AVAILABLE' ? 'success' : 'error'}
                />
                <Button size="small" startIcon={<EditIcon />} onClick={() => setOpen(true)}>
                  Düzenle
                </Button>
              </Stack>
            )}

            <Divider />

            <Typography variant="subtitle2">
              Atandığım Görevler ({tasks.length})
            </Typography>
            {tasks.length ? (
              tasks.map(t => (
                <Typography key={t.id} variant="body2">
                  • {t.task_name} <Chip size="small" label={t.status} sx={{ ml: 0.5 }} />
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Yok
              </Typography>
            )}
          </Stack>
        </CardContent>
      </InfoCard>

      {/* -------- Düzenle Pop-up -------- */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Profilimi Düzenle</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            {canChangeRole && (
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select label="Rol" value={role}
                  onChange={e => setRole(e.target.value as Role)}>
                  {roleOpts.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {canChangeStatus && (
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select label="Durum" value={status}
                  onChange={e => setStatus(e.target.value as Status)}>
                  {statusOpts.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={save}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;
