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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formDisabled, setFormDisabled] = useState(true);

  const { userSession } = useStateContext();

  const ppURL = userSession?.session?.user?.profileImage;
  const firstNameFromSession = userSession?.session?.user?.given_name;
  const lastNameFromSession = userSession?.session?.user?.family_name;
  const provider = userSession?.session?.user?.provider;
  const emailFromSession = userSession?.session?.user?.email;
  const letter = userSession?.session?.user?.given_name[0].toUpperCase();

  const handleEdit = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setEmailError("");
    setPassword("");

    setFormDisabled(false);
  };
  const handleSubmit = async (event) => {
    // Si les champs sont vides, on utilise les valeurs de la session.
    // Si le mot de passe est vide, on le laisse tel quel. S'il a été modifié, on le vérifie
    event.preventDefault();
    console.log({ firstName, lastName, email, password, provider });

    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(email === "" ? emailFromSession : email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    if (password && password.length < 8) {
      setPasswordError("Le mot de passe doit avoir au moins 8 caractères.");
      return;
    } else {
      setPasswordError("");
    }

    const response = await fetch("/api/modify-account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        firstName: !firstName ? firstNameFromSession : firstName,
        lastName: !lastName ? lastNameFromSession : lastName,
        email: !email ? emailFromSession : email,
        password: !password ? null : password,
        provider,
      }),
    });

    const data = await response.json();

    if (data.result === true) {
      toast.success("Compte mis à jour !");
      setFormDisabled(true);
    } else {
      toast.error(data.error);
      setFormDisabled(true);
    }

    console.log({ modifyAccount: data });
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
        <Avatar sx={{ m: 1, width: 64, height: 64 }} src={ppURL}>
          {letter}
        </Avatar>
        <Typography component="h1" variant="h5">
          Mon compte
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            required
            fullWidth
            id="firstName"
            label="Prénom"
            name="firstName"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName === "" ? firstNameFromSession : firstName}
            disabled={formDisabled}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Nom de famille"
            name="lastName"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName === "" ? lastNameFromSession : lastName}
            disabled={formDisabled}
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
            value={email === "" ? emailFromSession : email}
            disabled={formDisabled}
            error={emailError !== ""}
            helperText={emailError && emailError}
          />

          {provider === "credentials" && (
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
              value={password}
              disabled={formDisabled}
              error={passwordError !== ""}
              helperText={passwordError && passwordError}
            />
          )}

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
