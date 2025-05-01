import React from 'react';
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Role = 'DEVELOPER' | 'PROJECT_MANAGER' | 'GUEST';
type StatusColor = 'green' | 'red';

interface User {
  id: number;
  name: string;
  surname: string;
  mail: string;
  phone: string;
  role: Role;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  projectId: number | null;
  gorevId: number | null;
}

interface UserCardProps {
  user: User;
  taskName?: string | null;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

/* Stil ---------------------------------------------------------------*/
const Card = styled(MuiCard)(({ theme }) => {
  const d = theme.palette.mode === 'dark';
  return {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 380,
    minHeight: 200,
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(3px)',
    background: d
      ? 'radial-gradient(ellipse at 50% 50%, rgba(75,85,99,.4) 0%, rgba(31,41,55,.85) 100%)'
      : 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.6) 0%, rgba(238,242,247,.95) 100%)',
    boxShadow:
      'hsla(220,30%,5%,.25) 0 4px 12px, hsla(220,25%,10%,.12) 0 15px 25px -5px',
    transition: 'transform .15s, box-shadow .15s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow:
        'hsla(220,30%,5%,.35) 0 6px 18px, hsla(220,25%,10%,.2) 0 22px 35px -5px',
    },
  };
});

const StatusChip = styled(Chip)<{ statuscolor: StatusColor }>(({ statuscolor }) => ({
  backgroundColor: statuscolor === 'green' ? '#c5e8c7' : '#f7c6c6',
  color: statuscolor === 'green' ? '#2e7d32' : '#c62828',
  fontWeight: 600,
  textTransform: 'uppercase',
}));

/* Component ----------------------------------------------------------*/
const UserCard: React.FC<UserCardProps> = ({ user, taskName, onEdit, onDelete }) => {
  const viewerRole = (localStorage.getItem('user_role') as Role) ?? 'GUEST';
  const canManage = viewerRole === 'PROJECT_MANAGER';

  const roleMap: Record<User['role'], string> = {
    DEVELOPER: 'GELİŞTİRİCİ',
    PROJECT_MANAGER: 'PROJE YÖNETİCİSİ',
    GUEST: 'MİSAFİR',
  };

  const statusColor: StatusColor = user.status === 'AVAILABLE' ? 'green' : 'red';
  const statusText = user.status === 'AVAILABLE' ? 'BOŞTA' : 'ÇALIŞIYOR';

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name} {user.surname}</Typography>}
        action={
          canManage && (
            <>
              <IconButton size="small" aria-label="Düzenle" onClick={() => onEdit?.(user)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Sil"
                sx={{ color: '#d32f2f', ml: 0.5 }}
                onClick={() => onDelete?.(user)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )
        }
        sx={{ mb: -1 }}
      />

      <CardContent sx={{ pb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>{user.mail}</Typography>

        <Stack direction="column" spacing={0.75}>
          <Box>
            <Typography variant="caption" color="text.secondary">Rol:</Typography>{' '}
            <Typography variant="caption">{roleMap[user.role]}</Typography>
          </Box>

          <Box>
            <StatusChip size="small" label={statusText} statuscolor={statusColor} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
