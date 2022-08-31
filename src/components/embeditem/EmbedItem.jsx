import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Store } from "../../storage/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";

import moment from "moment";
import "moment/locale/ru";
import Api from "../../utils/Api";

moment.locale("ru");

const EmbedItem = (props) => {
  const s = props.system;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    fetchStatusHistory();
  };
  const handleClose = () => setOpen(false);

  const [statuses, setStatuses] = React.useState([]);

  const fetchStatusHistory = () => {
    Api.FetchStatusHistory(s.id, (r) => setStatuses(r.statuses));
  };

  if (!s.status) {
    s.status = {
      value: "0",
    };
  }

  let [statText, statColor] = getEmbedStatus(s.type, s.status.value);
  let [priorText, priorColor] = getEmbedPriority(s.priority);
  let online = s.online;

  return (
    <>
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
          <Typography
            color={grey[900]}
            sx={{ display: Store.IsDeveloper() ? "block" : "none" }}
          >
            {"Идентификатор: "}
            {s.id}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography color={grey[500]}>
              {"Статус: "}
              <Box component="span" sx={{ color: statColor, fontWeight: 500 }}>
                {statText}
              </Box>
            </Typography>
            <Button onClick={handleOpen} variant="outlined" size="small">
              История
            </Button>
          </Stack>
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
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>История статусов</DialogTitle>
        <List>
          {statuses.map((st) => {
            let [statusText, statusColor] = getEmbedStatus(s.type, st.value);
            let statusDate = getDisplayTime(st.updatedAt);
            return (
              <ListItem disablePadding key={st.id}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: grey[200], color: statusColor }}>
                      <CircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={statusText}
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondary={statusDate}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Dialog>
    </>
  );
};

const getEmbedStatus = (type, status) => {
  let statColor = "success.light";
  let statText = "В порядке";

  if (type === "drain") {
    if (status === "2") {
      statColor = "warning.light";
      statText = "Сильный поток";
    }
    if (status === "1") {
      statColor = "error.light";
      statText = "Требуется очистка";
    }
  }

  if (type === "trash") {
    if (status === "1") {
      statColor = "warning.light";
      statText = "Заполнено наполовину";
    }
    if (status === "2") {
      statColor = "error.light";
      statText = "Заполнено полностью";
    }
  }

  return [statText, statColor];
};

const getEmbedPriority = (priority) => {
  let priorText = "Обычный";
  let priorColor = grey[900];

  if (priority === "1") {
    priorText = "Повышенный";
    priorColor = "warning.main";
  }

  return [priorText, priorColor];
};

const getDisplayTime = (time) => {
  const localtime = moment(time);
  return time ? localtime.fromNow() : "Никогда";
};

export default EmbedItem;