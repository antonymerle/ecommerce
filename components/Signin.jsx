import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession, signIn, signOut } from "next-auth/react";
import NextLink from "next/link";
import Link from "@mui/material/Link";
import { forwardRef } from "react";
import { useState } from "react";
import Router from "next/router";

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
  const [authFailureMessage, setAuthFailureMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
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
      formType: "signin",
      redirect: false,
    });
    console.log({ result });
    if (result.status === 200) {
      Router.push("/");
    } else {
      setAuthFailureMessage("Echec de l'authentification.");
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
            Se connecter
          </Typography>
          <Box
            component="form"
            // onSubmit={handleSubmit}
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
                  onClick={() => signIn("google")}
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
                  onClick={() => signIn("facebook")}
                >
                  Continuer avec Facebook
                </Button>
              </Grid>
            </Grid>
            <Divider>Ou</Divider>
            {authFailureMessage && (
              <Alert severity="error">Echec de l'authentification.</Alert>
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
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Connexion
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="/auth/forgotPassword"
                  component={NextLink}
                  variant="body2"
                >
                  Mot de passe oublié?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/signup" component={NextLink} variant="body2">
                  {"Pas de compte? Inscrivez-vous"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions);
//   // If the user is already logged in, redirect.
//   // Note: Make sure not to redirect to the same page
//   // To avoid an infinite loop!
//   if (session) {
//     return { redirect: { destination: "/" } };
//   }
//   const providers = await getProviders();
//   return {
//     props: { providers: providers ?? [] },
//   }
//   console.log({ session });
// }
