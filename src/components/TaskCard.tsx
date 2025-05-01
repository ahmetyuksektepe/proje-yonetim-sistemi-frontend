import React from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";

interface Task {
  id: number;
  task_name: string;
  task_description: string;
  status: string;
  assignedProjectId: number | null;
  assignedUserId: number | null;
}

interface TaskCardProps {
  task: Task;
  projectName?: string | null;
  userName?: string | null;
  onEdit?: (task: Task) => void;
}

/*
 * Görünümü daraltıp (maxWidth ↓) hafif daha uzun göstermek (minHeight ↑) ve
 * içerik altına ek boşluk eklemek için güncelledik.
 */
const Card = styled(MuiCard)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: 380,      // önceki karttan daha dar
    minHeight: 190,     // biraz daha uzun
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: "blur(3px)",
    background: isDark
      ? "radial-gradient(ellipse at 50% 50%, rgba(75,85,99,0.40) 0%, rgba(31,41,55,0.85) 100%)"
      : "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(238,242,247,0.95) 100%)",
    boxShadow:
      "hsla(220, 30%, 5%, 0.25) 0px 4px 12px 0px, hsla(220, 25%, 10%, 0.12) 0px 15px 25px -5px",
    transition: "transform 150ms ease, box-shadow 150ms ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow:
        "hsla(220, 30%, 5%, 0.35) 0px 6px 18px 0px, hsla(220, 25%, 10%, 0.20) 0px 22px 35px -5px",
    },
  };
});

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  backgroundColor: theme.palette.mode === "dark" ? "#3e4c5d" : "#e8eef7",
  color: theme.palette.mode === "dark" ? "#c5d1e1" : theme.palette.text.secondary,
}));

const TaskCard: React.FC<TaskCardProps> = ({ task, projectName, userName, onEdit }) => (
  <Card>
    <CardHeader
      title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{task.task_name}</Typography>}
      action={
        <IconButton aria-label="Düzenle" onClick={() => onEdit?.(task)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      }
      sx={{ mb: -1 }}
    />

    <CardContent sx={{ pb: 2 /* alt boşluğu arttır */ }}>
      {task.task_description && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {task.task_description}
        </Typography>
      )}

      <Stack direction="column" spacing={0.75 /* satırlar arası biraz aç */}>
        {task.assignedProjectId && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Atandığı Proje:
            </Typography>{" "}
            {projectName ? (
              <Link component={RouterLink} to={`/home/projeler/${task.assignedProjectId}`}>{projectName}</Link>
            ) : (
              <Typography variant="caption">(yükleniyor…)</Typography>
            )}
          </Box>
        )}
        {task.assignedUserId && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Atanan Kişi:
            </Typography>{" "}
            {userName ? (
              <Link component={RouterLink} to={`/home/calisanlar/${task.assignedUserId}`}>{userName}</Link>
            ) : (
              <Typography variant="caption">(yükleniyor…)</Typography>
            )}
          </Box>
        )}
        <StatusChip size="small" label={task.status} />
      </Stack>
    </CardContent>
  </Card>
);

export default TaskCard;
