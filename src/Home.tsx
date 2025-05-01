import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsPeopleFill,
} from 'react-icons/bs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

const Home: React.FC = () => {
  const [projCount, setProjCount] = useState<number | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState('');

  /* ────────── Proje ekle modalı için durum ────────── */
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDate, setProjectDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    Promise.allSettled([
      axios.get('/api/projects'),
      axios.get('/api/tasks'),
      axios.get('/api/users'),
    ]).then(([p, t, u]) => {
      if (p.status === 'fulfilled') setProjCount(p.value.data.length);
      if (t.status === 'fulfilled') setTaskCount(t.value.data.length);
      if (u.status === 'fulfilled') setUserCount(u.value.data.length);
      [p, t, u].forEach((r) => {
        if (r.status === 'rejected') setError('Veriler tam alınamadı.');
      });
    });
  }, []);

  /* ────────── Proje ekle işlemi ────────── */
  const handleSave = () => {
    axios
      .put('/api/projects', {
        projectName,
        projectDate, // yyyy-MM-dd bekleniyor
      })
      .then(() => {
        setProjCount((c) => (c ?? 0) + 1); // sayacı anında güncelle
        setOpen(false);
        setProjectName('');
        setProjectDate('');
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || 'Proje eklenemedi');
      });
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>ANA MENÜ</h3>
      </div>

      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <div className="main-cards">
        {/* PROJE SAYISI */}
        <div className="card">
          <div className="card-inner">
            <h3>PROJELER</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{projCount ?? '...'}</h1>
        </div>

        {/* GÖREV SAYISI */}
        <div className="card">
          <div className="card-inner">
            <h3>GÖREVLER</h3>
            <BsListCheck className="card_icon" />
          </div>
          <h1>{taskCount ?? '...'}</h1>
        </div>

        {/* ÇALIŞAN SAYISI */}
        <div className="card">
          <div className="card-inner">
            <h3>ÇALIŞANLAR</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{userCount ?? '...'}</h1>
        </div>

        {/* ────────── “PROJE EKLE” KART-BUTONU ────────── */}
        <button className="card add-card" onClick={() => setOpen(true)}>
          <div className="card-inner" style={{ justifyContent: 'center' }}>
            <h3>➕ PROJE&nbsp;EKLE</h3>
          </div>
        </button>
      </div>

      {/* ────────── MODAL ────────── */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Yeni Proje</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="Proje Adı"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <TextField
              label="Proje Tarihi"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={handleSave}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Home;
