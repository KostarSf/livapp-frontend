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
          flexGrow: 1,
          py: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          height="100%"
        >
          <Map />

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
        <AccordionDetails sx={{ paddingLeft: { xs: 2, sm: 6 } }}>
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

function Map() {
  return (
    <Box>
      <Box
        flexGrow={1}
        component={Paper}
        sx={{
          position: "sticky",
          height: { xs: "50vh", md: "85vh" },
        }}
      >
        <Box
          component="img"
          src={MapImage}
          alt=""
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(0)",
          }}
        />
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
      address: "Анапское шоссе 11",
      description: "Находится на оживленном шоссе",
      status: {
        id: 1,
        value: "0",
        updatedAt: "2022-06-23T14:28:54.902Z",
      },
    },
    {
      id: 2,
      type: "drain",
      online: true,
      name: "Ливневка 2",
      priority: "0",
      address: "Анапское шоссе 24",
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
      online: true,
      name: "Ливневка 3",
      priority: "0",
      address: "ул. 2-я Лучезарная 13",
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
