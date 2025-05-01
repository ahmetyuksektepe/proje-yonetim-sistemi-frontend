import React from "react";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface ProjectCardProps {
  /** Projenin görünen adı */
  title?: string;
  /** Kısa açıklama */
  subtitle?: string;
  /** İleride projenin durumunu (örn. DONE, IN_PROGRESS) göstermek için */
  statusLabel?: string;
  /** Kartın içinde ekstra öğeler göstermek istersen children ile iletebilirsin */
  children?: React.ReactNode;
}

/*
 * Kullanıcının talebiyle kartın arka planı daha açık, grimsi bir tona
 * çekildi. Tema moduna göre hafif farkla renk ataması yapıyoruz.
 */
const Card = styled(MuiCard)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: "blur(3px)",
    background: isDark
      ? "radial-gradient(ellipse at 50% 50%, rgba(75,85,99,0.40) 0%, rgba(31,41,55,0.85) 100%)"
      : "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(238,242,247,0.95) 100%)",
    boxShadow:
      "hsla(220, 30%, 5%, 0.25) 0px 4px 12px 0px, hsla(220, 25%, 10%, 0.12) 0px 15px 25px -5px",
    color: theme.palette.text.primary,
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  title = "Proje Başlığı",
  subtitle = "Kısa açıklama buraya gelir…",
  statusLabel,
  children,
}) => (
  <Card>
    <CardHeader
      title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>}
      subheader={subtitle}
      action={statusLabel ? <StatusChip size="small" label={statusLabel} /> : null}
      sx={{
        mb: -1,
        "& .MuiCardHeader-subheader": { color: "text.secondary" },
      }}
    />

    <CardContent>
      {children ? (
        <Box sx={{ py: 1 }}>{children}</Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Buraya proje detayları, metin veya etiketler eklenecek.
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default ProjectCard;
