import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Role = 'PROJECT_MANAGER' | 'DEVELOPER' | 'GUEST';

interface ProjectCardProps {
  title?: string;
  subtitle?: string;
  statusLabel?: string;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

/* Stil ---------------------------------------------------------------*/
const Card = styled(MuiCard)(({ theme }) => {
  const d = theme.palette.mode === 'dark';
  return {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(3px)',
    background: d
      ? 'radial-gradient(ellipse at 50% 50%, rgba(75,85,99,0.40) 0%, rgba(31,41,55,0.85) 100%)'
      : 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(238,242,247,0.95) 100%)',
    boxShadow:
      'hsla(220, 30%, 5%, 0.25) 0px 4px 12px, hsla(220, 25%, 10%, 0.12) 0px 15px 25px -5px',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow:
        'hsla(220, 30%, 5%, 0.35) 0px 6px 18px, hsla(220, 25%, 10%, 0.20) 0px 22px 35px -5px',
    },
  };
});

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  backgroundColor: theme.palette.mode === 'dark' ? '#3e4c5d' : '#e8eef7',
  color: theme.palette.mode === 'dark' ? '#c5d1e1' : theme.palette.text.secondary,
}));

/* Component ----------------------------------------------------------*/
const ProjectCard: React.FC<ProjectCardProps> = ({
  title = 'Proje Başlığı',
  subtitle = 'Kısa açıklama…',
  statusLabel,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const role = (localStorage.getItem('user_role') as Role) ?? 'GUEST';
  const canManage = role === 'PROJECT_MANAGER';

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>}
        subheader={subtitle}
        action={
          <Stack direction="row" spacing={0.5} alignItems="center">
            {statusLabel && <StatusChip size="small" label={statusLabel} />}
            {canManage && (
              <>
                <IconButton size="small" aria-label="Ekle" onClick={onAdd} sx={{ color: '#2e7d32' }}>
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Düzenle" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Sil"
                  onClick={onDelete}
                  sx={{ color: '#d32f2f' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        }
        sx={{ mb: -1 }}
      />
      {/** İstenirse children */}
    </Card>
  );
};

export default ProjectCard;
