import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession, signIn, signOut } from "next-auth/react";
import NextLink from "next/link";
import Link from "@mui/material/Link";
import { forwardRef } from "react";
import { useState } from "react";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  return <NextLink ref={ref} {...props} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
  },
});

export default function SignIn() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    // Check if password meets security requirements
    if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8}$/)) {
      setPasswordError(
        "Le mot de passe doit avoir au moins 8 caractères dont un caractère special et une majuscule."
      );
      return;
    } else {
      setPasswordError("");
    }

    signIn("credentials", { email, password });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={emailError !== ""}
              helperText={emailError && emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              error={passwordError !== ""}
              helperText={passwordError && passwordError}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              // onClick={signIn("credentials", {username: ""})}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="/auth/forgotPassword"
                  component={NextLink}
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" component={NextLink} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
