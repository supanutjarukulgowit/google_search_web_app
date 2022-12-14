import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const theme = createTheme();



const SignInSide = () => {
  const navigate = useNavigate()
  const [inputs, setInputs] = React.useState({})
  const mySwal = withReactContent(Swal)
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({...values, [name]:value}))
  }
  const api = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 15000
  })
  const handleSubmit = (event) => {
    event.preventDefault();
    let request = {
      username: inputs.username,
      password: inputs.password,
    }
    let options = {
      method: 'POST',
      url: 'http://localhost:8080/api/auth/signIn',
      data: request
    }
    api
      .request(options)
      .then(response => {
        localStorage.setItem('g_search_token', response.data.data.token)
        navigate('/keywords', {
          state: {
            userId: response.data.data.user_id,
          }
        })
      })
      .catch(error => {
        let errResponse = error.response? error.response:{};
        let statusCodeResponse = errResponse.status? errResponse.status:0;
        let bodyResponse = errResponse.data ? errResponse.data:0;
        console.log(statusCodeResponse);
        if(statusCodeResponse === 401){
          console.log(bodyResponse);
          if(bodyResponse === 0){
            mySwal.fire({
              icon: 'error',
              title: 'ERROR_500',
              text: 'server error',
            })
          }else{
            mySwal.fire({
              icon: 'error',
              title: bodyResponse.error.code,
              text: bodyResponse.error.messageToUser,
            })
          }
        }else{
          mySwal.fire({
            icon: 'error',
            title: 'ERROR_500',
            text: 'server error',
          })
        }
      });
  };

  useEffect(() => {
    localStorage.removeItem('g_search_token');
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;