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
import SettingsIcon from "@mui/icons-material/Settings";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import {
  Alert,
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

import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = (props) => {
  const systems = props.systems;
  const notifySystems = systems.filter(
    (s) => s.status && s.status.value !== "0"
  );

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

  return (
    <>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
              <Box
                component="img"
                src={VegaLogoWhite}
                sx={{
                  height: 30,
                  display: { xs: "block" },
                }}
              />
            </Box>
            <Box
              sx={{
                display: { xs: "flex" },
                flexGrow: 1,
              }}
            >
              <MenuButtons embeds={notifySystems} />
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
                <MenuItem disabled onClick={handleCloseUserMenu}>
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

const MenuButtons = (props) => {
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const [anchorElWeather, setAnchorElWeather] = React.useState(null);
  const [anchorElDev, setAnchorElDev] = React.useState(null);

  const notifySystems = props.embeds;

  const handleClickDev = (event) => {
    setAnchorElDev(event.currentTarget);
  };

  const handleCloseDev = () => {
    setAnchorElDev(null);
  };

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
        <Box display="flex" alignItems="center" color={props.color || "black"}>
          {props.icon}
          <Typography variant="button" marginLeft={0.5} color="black">
            {props.temp}°
          </Typography>
        </Box>
        <Typography variant="body1">{props.day.toUpperCase()}</Typography>
      </Box>
    );
  };

  const SetEmbedStatus = async (id, value) => {
    await fetch(
      "https://emapi.kostarsf.space/api/embeded/status?api_key=fab7b608",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ systemId: id, value: value }),
      }
    );
  };

  const notifies = notifySystems.filter(
    (sys) => sys.status.value === (sys.type === "drain" ? "1" : "2")
  );

  let display_todays = moment().format("dddd, DD MMMM YYYY");
  display_todays = display_todays[0].toUpperCase() + display_todays.substring(1);

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <IconButton sx={{ color: "white" }} onClick={handleClickNotif}>
        <Badge badgeContent={notifies.length} color="warning">
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
            <ListSubheader>
              {notifies.length
                ? "Системы, требующие внимания"
                : "Новых уведомлений нет"}
            </ListSubheader>
          }
        >
          {notifies.map((sys) => (
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
      <Badge badgeContent="1" color="warning" variant="dot">
        <Button
          onClick={handleClickWeather}
          variant="text"
          startIcon={<CloudIcon />}
          sx={{
            color: "white",
          }}
        >
          19°
        </Button>
      </Badge>
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
        PaperProps={{
          sx: {
            maxWidth: { xs: "auto", sm: "350px" },
          },
        }}
      >
        <Typography
          variant="h6"
          component="p"
          color={grey[700]}
          fontWeight={300}
          textAlign="center"
          sx={{ px: 2, py: 2 }}
        >
          {/* Пятница, 23 июня 2022 */}
          {display_todays}
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          sx={{
            py: 2,
            px: 2,
          }}
          justifyContent="center"
        >
          <WeatherDay
            icon={<CloudIcon />}
            temp="19"
            day={moment().format("dd")}
          />
          <WeatherDay
            icon={<ThunderstormIcon />}
            temp="17"
            day={moment().add(1, "days").format("dd")}
            color="orange"
          />
          <WeatherDay
            icon={<WbSunnyIcon />}
            temp="24"
            day={moment().add(2, "days").format("dd")}
          />
        </Stack>
        <Link href="#" sx={{ px: 2 }} textAlign="center" display="block">
          Подробный прогноз
        </Link>
        <Alert severity="warning" sx={{ mt: 1 }}>
          Рекомендуется провести чистку систем перед осадками
        </Alert>
      </Popover>
      {Store.IsDeveloper() && (
        <>
          <IconButton sx={{ color: "white" }} onClick={handleClickDev}>
            <SettingsIcon />
          </IconButton>
          <Popover
            id="dev-popover"
            open={Boolean(anchorElDev)}
            anchorEl={anchorElDev}
            onClose={handleCloseDev}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            PaperProps={{
              sx: {
                p: 1,
              },
            }}
          >
            <Typography component="p" variant="h6">
              Ливневка:
            </Typography>
            <Stack direction="row">
              <Button onClick={() => SetEmbedStatus(1, "0")}>В порядке</Button>
              <Button onClick={() => SetEmbedStatus(1, "2")} color="warning">
                Сильный поток
              </Button>
              <Button onClick={() => SetEmbedStatus(1, "1")} color="error">
                Требуется очистка
              </Button>
            </Stack>
            <Typography component="p" variant="h6">
              Бак:
            </Typography>
            <Stack direction="row">
              <Button onClick={() => SetEmbedStatus(10, "0")}>В порядке</Button>
              <Button onClick={() => SetEmbedStatus(10, "1")} color="warning">
                Забит наполовину
              </Button>
              <Button onClick={() => SetEmbedStatus(10, "2")} color="error">
                Забит полностью
              </Button>
            </Stack>
          </Popover>
        </>
      )}
    </Stack>
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

export default Header;
