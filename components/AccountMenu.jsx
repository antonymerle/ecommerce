import { useState } from "react";
import { useStateContext } from "@/context/StateContext";
import { signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";

const customStyle = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
};

const menuItemSignin = (
  <MenuItem onClick={signIn} style={customStyle}>
    <ListItemIcon>
      <LoginIcon fontSize="small" />
    </ListItemIcon>
    Se connecter
  </MenuItem>
);

const menuItemSignout = (
  <MenuItem onClick={signOut} style={customStyle}>
    <ListItemIcon>
      <Logout fontSize="small" />
    </ListItemIcon>
    Se déconnecter
  </MenuItem>
);

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const { userSession } = useStateContext();
  const letter = userSession?.session?.user?.given_name[0].toUpperCase();
  const fullName =
    userSession?.session?.user?.given_name +
    userSession?.session?.user?.family_name;
  const ppURL = userSession?.session?.user?.profileImage;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Menu utilisateur">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar alt={fullName} src={ppURL} sx={{ width: 32, height: 32 }}>
              {letter}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link href={userSession ? "/account" : "/auth/signin"}>
          <MenuItem style={customStyle}>
            <Avatar alt={fullName} src={ppURL} sx={{ width: 32, height: 32 }} />{" "}
            Mon compte
          </MenuItem>
        </Link>

        <Divider />

        <Link href={userSession ? "/orders" : "/auth/signin"}>
          <MenuItem style={customStyle}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Mes commandes
          </MenuItem>
        </Link>

        <Link href={userSession ? "/favorites" : "/auth/signin"}>
          <MenuItem style={customStyle}>
            <ListItemIcon>
              <FavoriteBorderIcon />
            </ListItemIcon>
            Mes favoris
          </MenuItem>
        </Link>

        {userSession ? menuItemSignout : menuItemSignin}
      </Menu>
    </>
  );
}
