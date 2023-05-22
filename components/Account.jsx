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
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-hot-toast";

const Account = () => {
  const { data: session } = useSession();
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authFailureMessage, setAuthFailureMessage] = useState("");
  const [formDisabled, setFormDisabled] = useState(true);

  const { userSession } = useStateContext();

  const ppURL = userSession?.session?.user?.profileImage;
  const firstName = userSession?.session?.user?.given_name;
  const lastName = userSession?.session?.user?.family_name;
  const provider = userSession?.session?.user?.provider;
  const email = userSession?.session?.user?.email;
  const letter = userSession?.session?.user?.given_name[0].toUpperCase();

  const handleEdit = () => {
    switch (provider) {
      case "google":
        toast.error(
          "Vos informations sont fournies par votre compte Google et ne sont pas modifiables."
        );
        break;

      case "facebook":
        toast.error(
          "Vos informations sont fournies par votre compte Facebook et ne sont pas modifiables."
        );
        break;

      case "credentials":
        toast.success("Vous pouvez modifier vos informations.");
        setFormDisabled(false);
        break;

      default:
        toast.error("Erreur de session.");
        break;
    }
  };
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
        method: "PUT",
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
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }} src={ppURL}>
          {letter}
        </Avatar>
        <Typography component="h1" variant="h5">
          Mon compte
        </Typography>
        <Box
          component="form"
          // onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          {/* <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Modifier mes informations
          </Button> */}
          {/*
          <Grid container spacing={2}>
            <Grid item xs>
              <Typography component="h3">Nom:</Typography>
              <Typography component="h3">Nom:</Typography>
            </Grid>

            <Grid item xs>
              <Typography component="h3">Prénom:</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs>
              <Typography component="h3">Nom:</Typography>
            </Grid>

            <Grid item xs>
              <Typography component="h3">Prénom:</Typography>
            </Grid>
          </Grid>

          <Divider>Ou</Divider>
          {authFailureMessage && (
            <Alert severity="error">{authFailureMessage}</Alert>
          )} */}
          <Grid container spacing={2}>
            <Grid item md>
              <Typography component="h3">Type de compte: {provider}</Typography>
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleEdit}
          >
            Modifier mes informations
          </Button>
          <TextField
            margin="normal"
            // placeholder=""
            required
            fullWidth
            id="firstName"
            label="Prénom"
            name="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            disabled={formDisabled}
            // error={emailError !== ""}
            // helperText={emailError && emailError}
          />

          <TextField
            margin="normal"
            // placeholder=""
            required
            fullWidth
            id="lastName"
            label="Nom de famille"
            name="lastName"
            onChange={(e) => setFirstName(e.target.value)}
            value={lastName}
            disabled={formDisabled}
            // error={emailError !== ""}
            // helperText={emailError && emailError}
          />

          <TextField
            margin="normal"
            // placeholder=""
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={formDisabled}
            // error={emailError !== ""}
            // helperText={emailError && emailError}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={""}
            disabled={formDisabled}
            error={passwordError !== ""}
            helperText={passwordError && passwordError}
          />

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Valider
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/favorites" component={NextLink} variant="body2">
                Favoris
              </Link>
            </Grid>
            <Grid item>
              <Link href="/orders" component={NextLink} variant="body2">
                Mes commandes
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Account;
