import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";
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

export default function SignUp() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authFailureMessage, setAuthFailureMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Entre une adresse email valide, svp.");
      return;
    } else {
      setEmailError("");
    }

    // Check if password meets security requirements
    // if (!password.match(/^(?=.*[A-Z])(?=.*[!@#$&*]).{8}$/)) {
    if (password.length < 8) {
      setPasswordError("Le mot de passe doit avoir au moins 8 caractères.");
      return;
    } else {
      setPasswordError("");
    }

    const result = await signIn("credentials", {
      email,
      password,
      formType: "signup",
      redirect: false,
      callbackUrl: "/auth/signin?error=Default",
    });

    console.log({ result });

    if (result.status === 200) {
      Router.push("/");
    } else {
      // requête directe du serveur pour obtenir le message d'erreur.
      const retrieveErrorMessage = await fetch("/api/auth/credentials-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ email, password, formType: "signup" }),
      });

      const response = await retrieveErrorMessage.json();
      console.log(response);

      setAuthFailureMessage(response.error);
    }
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
            Inscription
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => signIn("google", { formType: "signup" })}
                >
                  Continuer avec Google
                </Button>
              </Grid>

              <Grid item xs>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => signIn("facebook", { formType: "signup" })}
                >
                  Continuer avec Facebook
                </Button>
              </Grid>
            </Grid>
            <Divider>Ou avec votre email</Divider>
            {authFailureMessage && (
              <Alert severity="error">{authFailureMessage}</Alert>
            )}
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
              Valider
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/auth/signin" component={NextLink} variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
