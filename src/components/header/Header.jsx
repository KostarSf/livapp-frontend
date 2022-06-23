import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import VegaLogoWhite from "../../images/vega_logo_white.svg";
import AdbIcon from "@mui/icons-material/Adb";
import { Store } from "../../storage/Store";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterIcon from "@mui/icons-material/Water";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudIcon from "@mui/icons-material/Cloud";
import {
  Badge,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Stack,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = (props) => {
  const systems = props.systems;
  const notifySystems = systems.filter((s) => s.status.value === "1");

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const MenuButtons = () => {
    const [anchorElNotif, setAnchorElNotif] = React.useState(null);
    const [anchorElWeather, setAnchorElWeather] = React.useState(null);

    const handleClickNotif = (event) => {
      setAnchorElNotif(event.currentTarget);
    };

    const handleCloseNotif = () => {
      setAnchorElNotif(null);
    };

    const handleClickWeather = (event) => {
      setAnchorElWeather(event.currentTarget);
    };

    const handleCloseWeather = () => {
      setAnchorElWeather(null);
    };

    const WeatherDay = (props) => {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" alignItems="center">
            {props.icon}
            <Typography variant="button" marginLeft={0.5}>
              {props.temp}°
            </Typography>
          </Box>
          <Typography variant="body1">{props.day}</Typography>
        </Box>
      );
    };

    return (
      <Stack spacing={2} direction="row" alignItems="center">
        <IconButton sx={{ color: "white" }} onClick={handleClickNotif}>
          <Badge badgeContent={notifySystems.length} color="warning">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          id="notify-popover"
          open={Boolean(anchorElNotif)}
          anchorEl={anchorElNotif}
          onClose={handleCloseNotif}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List
            subheader={
              <ListSubheader>Системы, требующие внимания</ListSubheader>
            }
          >
            {notifySystems.map((sys) => (
              <React.Fragment key={sys.id}>
                <ListItemButton>
                  <ListItemIcon>
                    {sys.type === "drain" ? <WaterIcon /> : <DeleteIcon />}
                  </ListItemIcon>
                  <ListItemText primary={sys.name} secondary={sys.address} />
                </ListItemButton>
              </React.Fragment>
            ))}
          </List>
        </Popover>
        <Button
          onClick={handleClickWeather}
          variant="text"
          startIcon={<CloudIcon />}
          sx={{
            color: "white",
          }}
        >
          24°
        </Button>
        <Popover
          id="weather-popover"
          open={Boolean(anchorElWeather)}
          anchorEl={anchorElWeather}
          onClose={handleCloseWeather}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Stack
            spacing={2}
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            sx={{
              py: 1,
              px: 2,
            }}
          >
            <WeatherDay icon={<CloudIcon />} temp="19" day="ПТ" />
            <WeatherDay icon={<CloudIcon />} temp="18" day="СБ" />
            <WeatherDay icon={<WbSunnyIcon />} temp="24" day="ВС" />
          </Stack>
          <Link href="#" sx={px: 2}>Подробный прогноз</Link>
        </Popover>
        <DevLabel />
      </Stack>
    );
  };

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component="img"
              src={VegaLogoWhite}
              sx={{ height: 30, mr: 2, display: { xs: "none", md: "block" } }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Box
                component="img"
                src={VegaLogoWhite}
                sx={{
                  height: 30,
                  display: { xs: "block", md: "none" },
                }}
              />
            </Box>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              <MenuButtons />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <MenuButtons />
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Открыть настройки">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={Store.GetEmail() || ""}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Аккаунт</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    exitAction();
                  }}
                >
                  <Typography textAlign="center">Выйти</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};

function exitAction() {
  Store.LogOut();
  window.location.reload();
}

function ExitBtn() {
  return (
    <Button
      sx={{ my: 2, color: "white", display: "block" }}
      onClick={exitAction}
    >
      Выход
    </Button>
  );
}

function DevLabel() {
  if (Store.IsDeveloper() === false) {
    return <></>;
  }

  return (
    <Typography variant="button" marginY="auto" marginLeft={2}>
      Режим Разработчика
    </Typography>
  );
}

export default Header;
