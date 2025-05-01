import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Checkbox, CssBaseline, Divider, FormControlLabel,
  FormLabel, FormControl, Link, TextField, Typography, Stack
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();

  const [mailError, setMailError] = React.useState(false);
  const [mailErrorMessage, setMailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [surnameError, setSurnameError] = React.useState(false);
  const [surnameErrorMessage, setSurnameErrorMessage] = React.useState('');
  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');

  const validateInputs = () => {
    const mail = document.getElementById('mail') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const surname = document.getElementById('surname') as HTMLInputElement;
    const phone = document.getElementById('phone') as HTMLInputElement;

    let isValid = true;

    if (!mail.value || !/\S+@\S+\.\S+/.test(mail.value)) {
      setMailError(true);
      setMailErrorMessage('Geçerli bir e-posta adresi girin.');
      isValid = false;
    } else {
      setMailError(false);
      setMailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Şifre en az 6 karakter olmalı.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value) {
      setNameError(true);
      setNameErrorMessage('İsim gerekli.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!surname.value) {
      setSurnameError(true);
      setSurnameErrorMessage('Soyisim gerekli.');
      isValid = false;
    } else {
      setSurnameError(false);
      setSurnameErrorMessage('');
    }

    if (!phone.value || phone.value.length < 10) {
      setPhoneError(true);
      setPhoneErrorMessage('Telefon numarası en az 10 haneli olmalı.');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);

    const payload = {
      name: data.get('name'),
      surname: data.get('surname'),
      mail: data.get('mail'),
      password: data.get('password'),
      phone: data.get('phone'),
      role: "DEVELOPER",
      status: "AVAILABLE"
    };
    
    try {
      const response = await axios.post('/api/users/register', payload);
      alert('Kayıt başarılı!');
      navigate('/giris'); // Başarılı kayıt sonrası yönlendirme
    } catch (error: any) {
      console.error(error);
      alert('Kayıt sırasında hata oluştu.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Kaydol
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">İsim</FormLabel>
              <TextField
                name="name"
                id="name"
                required
                fullWidth
                placeholder="Ahmet"
                error={nameError}
                helperText={nameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="surname">Soyisim</FormLabel>
              <TextField
                name="surname"
                id="surname"
                required
                fullWidth
                placeholder="Yüksektepe"
                error={surnameError}
                helperText={surnameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="mail">Email</FormLabel>
              <TextField
                name="mail"
                id="mail"
                required
                fullWidth
                placeholder="ornek@mail.com"
                error={mailError}
                helperText={mailErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Şifre</FormLabel>
              <TextField
                type="password"
                name="password"
                id="password"
                required
                fullWidth
                placeholder="••••••"
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Telefon</FormLabel>
              <TextField
                type="tel"
                name="phone"
                id="phone"
                required
                fullWidth
                placeholder="05XXXXXXXXX"
                error={phoneError}
                helperText={phoneErrorMessage}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Kaydol
            </Button>
          </Box>

          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>veya</Typography>
          </Divider>

          <Typography sx={{ textAlign: 'center' }}>
            Zaten hesabın var mı?{' '}
            <Link href="/giris" variant="body2">
              Giriş yap
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
