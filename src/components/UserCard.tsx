import React from "react";
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
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

interface User {
  id: number;
  name: string;
  surname: string;
  mail: string;
  phone: string;
  role: "DEVELOPER" | "PROJECT_MANAGER" | "GUEST";
  status: "AVAILABLE" | "UNAVAILABLE";
  projectId: number | null;
  gorevId: number | null;
}

interface UserCardProps {
  user: User;
  /** Proje adı dışarıdan verilir */
  projectName?: string | null;
  /** Görev (task) adı dışarıdan verilir */
  taskName?: string | null;
  /** Düzenle butonu tıklandığında */
  onEdit?: (user: User) => void;
}

/* Kart görünümü */
const Card = styled(MuiCard)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: 380,
    minHeight: 200,
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

/* Durum Chip'i renkli */
const StatusChip = styled(Chip)<{ statuscolor: "green" | "red" }>(({ statuscolor }) => ({
  backgroundColor: statuscolor === "green" ? "#c5e8c7" : "#f7c6c6",
  color: statuscolor === "green" ? "#2e7d32" : "#c62828",
  fontWeight: 600,
  textTransform: "uppercase",
}));

const UserCard: React.FC<UserCardProps> = ({ user, projectName, taskName, onEdit }) => {
  /* Rol çevirisi */
  const roleMap: Record<User["role"], string> = {
    DEVELOPER: "GELİŞTİRİCİ",
    PROJECT_MANAGER: "PROJE YÖNETİCİSİ",
    GUEST: "MİSAFİR",
  };

  const statusColor = user.status === "AVAILABLE" ? "green" : "red";
  const statusText = user.status === "AVAILABLE" ? "BOŞTA" : "ÇALIŞIYOR";

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user.name} {user.surname}
          </Typography>
        }
        action={
          <IconButton aria-label="Düzenle" onClick={() => onEdit?.(user)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        }
        sx={{ mb: -1 }}
      />

      <CardContent sx={{ pb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {user.mail}
        </Typography>

        <Stack direction="column" spacing={0.75}>
          {/* Rol */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Rol:
            </Typography>{" "}
            <Typography variant="caption">{roleMap[user.role]}</Typography>
          </Box>

          {/* Durum */}
          <Box>
            <StatusChip size="small" label={statusText} statuscolor={statusColor} />
          </Box>

          {/* Proje */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Atandığı Proje:
            </Typography>{" "}
            {user.projectId && projectName ? (
              <Link component={RouterLink} to={`/home/projeler/${user.projectId}`}>{projectName}</Link>
            ) : (
              <Typography variant="caption">YOK</Typography>
            )}
          </Box>

          {/* Görev */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Atandığı Görev:
            </Typography>{" "}
            {user.gorevId && taskName ? (
              <Link component={RouterLink} to={`/home/gorevler/${user.gorevId}`}>{taskName}</Link>
            ) : (
              <Typography variant="caption">YOK</Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
