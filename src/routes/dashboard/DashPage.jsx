import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Zoom,
} from "@mui/material";
import * as React from "react";
import Header from "../../components/header/Header";
import { Store } from "../../storage/Store";
import MapImage from "../../images/map.png";
import MapRouteImage from "../../images/map_route.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RouteIcon from "@mui/icons-material/Route";
import { grey } from "@mui/material/colors";
import moment from "moment";
import "moment/locale/ru";
import EmbedItem from "../../components/embeditem/EmbedItem";
import Api from "../../utils/Api";

moment.locale("ru");

const DashPage = () => {
  const [systemType, setSystemType] = React.useState("drain");
  const [embeds, setEmbeds] = React.useState([]);

  const fetchEmbeds = () => {
    Api.FetchSystems((r) => setEmbeds(r.systems));
  };

  React.useEffect(() => {
    fetchEmbeds();
    setInterval(fetchEmbeds, 4000);
  }, []);

  return (
    <Box
      position="relative"
      minHeight="100vh"
      overflowY="scroll"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header systems={embeds} />

      <Container
        maxWidth="xl"
        sx={{
          py: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          height="100%"
          width="100%"
          sx={{
            flexGrow: 1,
          }}
        >
          <Map systems={embeds} />
          <Box>
            <Box marginBottom={2}>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant={systemType === "drain" ? "contained" : "text"}
                  fullWidth
                  onClick={() => setSystemType("drain")}
                >
                  Ливневки
                </Button>
                <Button
                  variant={systemType === "trash" ? "contained" : "text"}
                  fullWidth
                  onClick={() => setSystemType("trash")}
                >
                  Баки
                </Button>
              </Stack>
            </Box>
            <SystemsList type={systemType} embeds={embeds} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

function SystemsList(props) {
  let systems = props.embeds
    .filter((sys) => sys.type === props.type)
    .sort((a, b) => a.id - b.id);

  return (
    <Box>
      {systems.map((s) => (
        <EmbedItem system={s} />
      ))}
    </Box>
  );
}

function Map(props) {
  const [filter, setFilter] = React.useState("all");
  const [showRoute, setRoute] = React.useState(false);

  let systems = props.systems.filter((sys) => sys.coords);

  if (filter !== "all") {
    systems = systems.filter((sys) => sys.type === filter);
  }

  const MapDot = (props) => {
    let sys = props.system;

    if (!sys.status) {
      sys.status = {
        value: "-1",
      };
    }

    let x = sys.coords.split(" ")[0];
    let y = sys.coords.split(" ")[1];

    let bgcolor = "success.light";

    if (sys.type === "drain") {
      if (sys.status.value === "2") {
        bgcolor = "warning.light";
      }
      if (sys.status.value === "1") {
        bgcolor = "error.light";
      }
    }

    if (sys.type === "trash") {
      if (sys.status.value === "1") {
        bgcolor = "warning.light";
      }
      if (sys.status.value === "2") {
        bgcolor = "error.light";
      }
    }

    let size = 30;

    return (
      <>
        <Box
          sx={{
            width: size + "px",
            height: size + "px",
            bgcolor: bgcolor,
            position: "absolute",
            borderRadius: "50%",
            top: `calc(${y}% - ${size / 2}px)`,
            left: `calc(${x}% - ${size / 2}px)`,
            border: "6px solid white",
            boxShadow: "0px 2px 4px 0px rgba(34, 60, 80, 0.4)",
          }}
        ></Box>
        <Box
          sx={{
            display: sys.online ? "block" : "none",
            position: "absolute",
            top: `calc(${y}% - ${size / 2.5}px)`,
            left: `calc(${x}% + ${size / 1.5}px)`,
            bgcolor: "white",
            px: 1,
            borderRadius: 2,
            py: 1,
            boxShadow: "0px 2px 4px 0px rgba(34, 60, 80, 0.2)",
          }}
        >
          <Typography
            variant="button"
            color={sys.online ? "primary" : grey[700]}
            component="p"
            sx={{
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            {sys.name}
          </Typography>
          <Typography
            variant="body2"
            color={grey[500]}
            component="p"
            sx={{
              fontSize: 15,
            }}
          >
            {sys.address}
          </Typography>
        </Box>
      </>
    );
  };

  return (
    <Box
      component={Paper}
      sx={{
        width: "100%",
        height: { xs: "50vh", md: "auto" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
        }}
      >
        <Box
          width="1323px"
          height="909px"
          sx={{
            background: `url(${showRoute ? MapRouteImage : MapImage})`,
            position: "relative",
          }}
        >
          {systems.map((sys) => (
            <MapDot system={sys} key={sys.id} />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          pointerEvents: "none",
        }}
      >
        <Stack
          direction="row"
          sx={{ m: 1, pointerEvents: "all" }}
          alignItems="center"
        >
          <Box component={Paper}>
            <Button
              sx={{ px: { xs: 0, sm: 2 } }}
              onClick={() => {
                setRoute((s) => !s);
                setFilter("all");
              }}
              variant={showRoute ? "contained" : "text"}
            >
              <RouteIcon />
              <Typography
                sx={{
                  ml: 1,
                  display: { xs: "none", sm: "inline-block" },
                }}
              >
                Маршрут очистки
              </Typography>
            </Button>
          </Box>
          <Box flexGrow={1} />
          <Box
            component={Paper}
            sx={{
              mr: 2,
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              onChange={(e, v) => {
                setFilter(v);
                setRoute(false);
              }}
              size="small"
            >
              <ToggleButton value="all">Все</ToggleButton>
              <ToggleButton value="drain">Ливневки</ToggleButton>
              <ToggleButton value="trash">Баки</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
        <Stack
          direction="row"
          sx={{ mx: 1, display: showRoute ? "flex" : "none" }}
        >
          <Box component={Paper} sx={{ px: 1 }}>
            <Typography>5 точек, 12км</Typography>
            <Typography>Время: 30мин</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

const getDisplayTime = (time) => {
  const localtime = moment(time);
  return time ? localtime.fromNow() : "Никогда";
};

function getFakeSystemsA(systemType = null) {
  const systems = [
    {
      id: 1,
      type: "drain",
      online: true,
      name: "Ливневка 1",
      priority: "1",
      address: "ул. Осоавиахима 21",
      description: "Дорога на склоне",
      coords: "38 40",
      status: {
        id: 1,
        value: "0",
        updatedAt: "2022-06-23T14:28:54.902Z",
      },
    },
    {
      id: 2,
      type: "drain",
      online: false,
      name: "Ливневка 2",
      priority: "0",
      address: "Анапское шоссе 24",
      coords: "45 30",
      description: "Находится на оживленном шоссе",
      status: {
        id: 2,
        value: "1",
        updatedAt: "2022-06-23T14:28:54.902Z",
      },
    },
    {
      id: 3,
      type: "drain",
      online: false,
      name: "Ливневка 3",
      priority: "0",
      address: "ул. 2-я Лучезарная 13",
      coords: "42 53",
      status: {
        id: 3,
        value: "2",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 4,
      type: "drain",
      online: false,
      name: "Ливневка 4",
      priority: "0",
      address: "ул. Борисовская 3",
      coords: "57 60",
      status: {
        id: 4,
        value: "0",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 5,
      type: "drain",
      online: false,
      name: "Ливневка 5",
      priority: "0",
      address: "ул. Советов 36",
      status: {
        id: 5,
        value: "2",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 6,
      type: "drain",
      online: false,
      name: "Ливневка 6",
      priority: "0",
      address: "ул. Свердлова 88",
      status: {
        id: 6,
        value: "2",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 7,
      type: "drain",
      online: false,
      name: "Ливневка 7",
      priority: "0",
      address: "ул. Волгоградская 115",
      status: {
        id: 7,
        value: "1",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 8,
      type: "drain",
      online: false,
      name: "Ливневка 8",
      priority: "0",
      address: "ул. Рабочая 28",
      status: {
        id: 8,
        value: "0",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 9,
      type: "drain",
      online: false,
      name: "Ливневка 9",
      priority: "0",
      address: "ул. Промышленная 42",
      status: {
        id: 9,
        value: "0",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 10,
      type: "trash",
      online: true,
      name: "Бак 1",
      priority: "0",
      address: "Анапское шоссе 57",
      coords: "32 18",
      description: "Во внутреннем дворе",
      status: {
        id: 1,
        value: "0",
        updatedAt: "2022-06-23T14:28:54.902Z",
      },
    },
    {
      id: 11,
      type: "trash",
      online: false,
      name: "Бак 2",
      priority: "0",
      address: "ул. Рабочая 28",
      status: {
        id: 8,
        value: "1",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
    {
      id: 12,
      type: "trash",
      online: false,
      name: "Бак 3",
      priority: "0",
      address: "ул. Промышленная 42",
      status: {
        id: 9,
        value: "2",
        updatedAt: "2022-06-20T09:50:13.956Z",
      },
    },
  ];

  if (systemType) {
    return systems.filter((s) => s.type === systemType);
  }

  return systems;
}

export default DashPage;
