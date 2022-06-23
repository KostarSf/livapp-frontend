import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@mui/material";
import * as React from "react";
import Header from "../../components/header/Header";
import { Store } from "../../storage/Store";
import MapImage from "../../images/map.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";
import moment from "moment";
import "moment/locale/ru";

moment.locale("ru");

const DashPage = () => {
  const [systemType, setSystemType] = React.useState("drain");

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
      <Header systems={getFakeSystems()} />

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
          <Map systems={getFakeSystems()} />
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
            <SystemsList systemType={systemType} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

function SystemsList(props) {
  let systems = getFakeSystems(props.systemType);

  let list = systems.map((s) => {
    let statColor = "success.light";
    let statText = "В порядке";
    let priorText = "Обычный";
    let priorColor = grey[900];
    let online = s.online;

    if (s.priority === "1") {
      priorText = "Повышенный";
      priorColor = "warning.main";
    }

    if (s.type === "drain") {
      if (s.status.value === "2") {
        statColor = "warning.light";
        statText = "Сильный поток";
      }
      if (s.status.value === "1") {
        statColor = "error.light";
        statText = "Требуется очистка";
      }
    }

    if (s.type === "trash") {
      if (s.status.value === "1") {
        statColor = "warning.light";
        statText = "Заполнено наполовину";
      }
      if (s.status.value === "2") {
        statColor = "error.light";
        statText = "Заполнено полностью";
      }
    }

    return (
      <Accordion key={s.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Box
              component="span"
              sx={{
                bgcolor: online ? statColor : grey[300],
                width: 15,
                height: 15,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: statColor,
              }}
            />
            <Typography
              noWrap
              display={{ xs: "none", sm: "flex" }}
              width={{ xs: "0", sm: 110 }}
              fontWeight={500}
              color={online ? "black" : grey[500]}
            >
              {s.name}
            </Typography>
            <Typography
              noWrap
              width={{ xs: "auto", md: 200 }}
              paddingRight={1}
              color={grey[500]}
            >
              {s.address}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails
          sx={{ paddingLeft: { xs: 2, sm: 6 }, position: "relative" }}
        >
          <Typography color={grey[500]}>
            {"Статус: "}
            <Box component="span" sx={{ color: statColor, fontWeight: 500 }}>
              {statText}
            </Box>
          </Typography>
          <Typography color={grey[500]}>
            {"Приоритет: "}
            <Box component="span" sx={{ color: priorColor, fontWeight: 500 }}>
              {priorText}
            </Box>
          </Typography>
          <Typography color={grey[500]} sx={{ mt: 3 }}>
            {"Обновлено: "}
            <Box component="span" sx={{ color: grey[900], fontWeight: 500 }}>
              {getDisplayTime(s.status.updatedAt)}
            </Box>
          </Typography>
          <Typography color={grey[700]} fontWeight={500} sx={{ mt: 3 }}>
            {s.description}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  });

  return <Box>{list}</Box>;
}

function Map(props) {
  let systems = props.systems.filter((sys) => sys.coords !== undefined);

  const MapDot = (props) => {
    const sys = props.system;

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
            background: `url(${MapImage})`,
            position: "relative",
          }}
        >
          {systems.map((sys) => (
            <MapDot system={sys} key={sys.id} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const getDisplayTime = (time) => {
  const localtime = moment(time);
  return time ? localtime.fromNow() : "Никогда";
};

function getFakeSystems(systemType = null) {
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
