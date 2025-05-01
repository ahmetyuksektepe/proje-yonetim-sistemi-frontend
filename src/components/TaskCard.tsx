import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  Link,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'NEEDS_REVIEW' | 'FINISHED';
type Role = 'PROJECT_MANAGER' | 'DEVELOPER' | 'GUEST';

interface Task {
  id: number;
  task_name: string;
  task_description: string;
  status: TaskStatus;
  assignedProjectId: number | null;
  assignedUserId: number | null;
}

interface TaskCardProps {
  task: Task;
  projectName?: string | null;
  userName?: string | null;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

/* Stil ---------------------------------------------------------------*/
const Card = styled(MuiCard)(({ theme }) => {
  const d = theme.palette.mode === 'dark';
  return {
    position: 'relative',
    width: '100%',
    maxWidth: 380,
    minHeight: 190,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
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

/* Status Chip --------------------------------------------------------*/
const StyledChip = styled(Chip)<{ bgcolor: string; fg: string }>(({ bgcolor, fg }) => ({
  backgroundColor: bgcolor,
  color: fg,
  fontWeight: 600,
  textTransform: 'uppercase',
}));

const statusMap = {
  TODO: {
    label: 'YAPILACAK',
    bgcolor: '#fff3cd',
    fg: '#b28704',
    icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />,
  },
  IN_PROGRESS: {
    label: 'YAPIM AŞAMASINDA',
    bgcolor: '#d0f5e0',
    fg: '#1b5e20',
    icon: <AutorenewIcon sx={{ fontSize: 16 }} />,
  },
  NEEDS_REVIEW: {
    label: 'İNCELEME',
    bgcolor: '#cfd8dc',
    fg: '#37474f',
    icon: <SearchIcon sx={{ fontSize: 16 }} />,
  },
  FINISHED: {
    label: 'TAMAMLANDI',
    bgcolor: '#c8e6c9',
    fg: '#256029',
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
  },
} as const;

/* Component ----------------------------------------------------------*/
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  projectName,
  userName,
  onEdit,
  onDelete,
}) => {
  const role = (localStorage.getItem('user_role') as Role) ?? 'GUEST';
  const canEdit = role === 'PROJECT_MANAGER' || role === 'DEVELOPER';
  const canDelete = role === 'PROJECT_MANAGER';

  const s = statusMap[task.status];

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{task.task_name}</Typography>}
        action={
          <>
            {canEdit && (
              <IconButton size="small" aria-label="Düzenle" onClick={() => onEdit?.(task)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {canDelete && (
              <IconButton
                size="small"
                aria-label="Sil"
                onClick={() => onDelete?.(task)}
                sx={{ color: '#d32f2f', ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </>
        }
        sx={{ mb: -1 }}
      />

      <CardContent sx={{ pb: 2 }}>
        {task.task_description && (
          <Typography variant="body2" sx={{ mb: 1 }}>{task.task_description}</Typography>
        )}

        <Stack direction="column" spacing={0.75}>
          {task.assignedProjectId && (
            <Box>
              <Typography variant="caption" color="text.secondary">Atandığı Proje:</Typography>{' '}
              {projectName
                ? <Link component={RouterLink} to={`/home/projeler/${task.assignedProjectId}`}>{projectName}</Link>
                : <Typography variant="caption">(yükleniyor…)</Typography>}
            </Box>
          )}

          {task.assignedUserId && (
            <Box>
              <Typography variant="caption" color="text.secondary">Atanan Kişi:</Typography>{' '}
              {userName
                ? <Link component={RouterLink} to={`/home/calisanlar/${task.assignedUserId}`}>{userName}</Link>
                : <Typography variant="caption">(yükleniyor…)</Typography>}
            </Box>
          )}

          <StyledChip size="small" {...s} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
