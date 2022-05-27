import React from "react";
import moment from "moment";
import "moment/locale/ru";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Modal, Nav, Navbar } from "react-bootstrap";

moment.locale("ru");

function App() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#">Обзор ливневок</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">Статус</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <TodoListCard />
      </Container>
    </>
  );
}

const apiurl = "http://172.22.53.67:5000";
const enableActions = false;

function TodoListCard() {
  const [drains, setDrains] = React.useState(null);
  const [statuses, setStatuses] = React.useState([]);

  const fetchData = () => {
    fetch(apiurl + "/drains/display")
      .then((r) => r.json())
      .then(setDrains);
    fetch(apiurl + "/statuses")
      .then((r) => r.json())
      .then(setStatuses);
  };

  React.useEffect(() => {
    fetchData();
    setInterval(fetchData, 4000);
  }, []);

  const onNewDrain = React.useCallback(
    (newDrain) => {
      setDrains([...drains, setDrains]);
    },
    [drains]
  );

  const onDrainUpdate = React.useCallback(
    (drain) => {
      const index = drains.findIndex((i) => i.id === drain.id);
      setDrains([...drains.slice(0, index), drain, ...drains.slice(index + 1)]);
    },
    [drains]
  );

  const onDrainRemoval = React.useCallback(
    (drain) => {
      const index = drains.findIndex((i) => i.id === drain.id);
      setDrains([...drains.slice(0, index), ...drains.slice(index + 1)]);
    },
    [drains]
  );

  if (drains === null) return "Loading...";

  return (
    <React.Fragment>
      {enableActions && <AddDrainForm onNewDrain={onNewDrain} />}
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Название</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>Обновлено</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {drains.map((drain) =>
            drain.id ? (
              <DrainDisplay
                drain={drain}
                statuses={statuses.filter((s) => s.storm_drain_id === drain.id)}
                key={`${drain.id}-${drain.name}`}
                onDrainUpdate={onDrainUpdate}
                onDrainRemoval={onDrainRemoval}
              />
            ) : (
              <tr key={`${drain.id}-${drain.name}`}>
                <td></td>
                <td>Загрузка информации...</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      {drains.length === 0 && (
        <p className="text-center">Ливневок в списке пока нет</p>
      )}
    </React.Fragment>
  );
}

function AddDrainForm({ onNewDrain }) {
  const [drainName, setDrainName] = React.useState("");
  const [drainAddress, setDrainAddress] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submitNewDrain = (e) => {
    e.preventDefault();
    setSubmitting(true);
    fetch(apiurl + "/drains", {
      method: "POST",
      body: JSON.stringify({ name: drainName, address: drainAddress }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((drain) => {
        //onNewDrain(drain);
        setSubmitting(false);
        setDrainName("");
        setDrainAddress("");
      });
  };

  return (
    <Form onSubmit={submitNewDrain}>
      <InputGroup className="mb-3">
        <Form.Control
          value={drainName}
          onChange={(e) => setDrainName(e.target.value)}
          type="text"
          placeholder="Название"
          aria-describedby="basic-addon1"
        />
        <Form.Control
          value={drainAddress}
          onChange={(e) => setDrainAddress(e.target.value)}
          type="text"
          placeholder="Адрес"
          aria-describedby="basic-addon1"
        />
        <Button
          type="submit"
          variant="success"
          disabled={!drainName.length || !drainAddress.length}
          className={submitting ? "disabled" : ""}
        >
          {submitting ? "Добавление..." : "Добавить ливневку"}
        </Button>
      </InputGroup>
    </Form>
  );
}

function DrainDisplay({ drain, statuses, onDrainUpdate, onDrainRemoval }) {
  const [historyShow, setShow] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  const showHistory = () => {
    setShow(true);
  };

  const clearHistory = () => {
    fetch(apiurl + `/drains/${drain.id}/statuses`, { method: "DELETE" });
  };

  const hideHistory = () => {
    setShow(false);
  };

  const removeDrain = () => {
    fetch(apiurl + `/drains/${drain.id}`, { method: "DELETE" }).then(() => {
      setDeleted(true);
    });
  };

  const getStatusInfo = (value) => {
    if (!value) {
      return ["#bbb", "Неизвестно"];
    }
    if (value === "0") {
      return ["transparent", "В норме"];
    }
    if (value === "1") {
      return ["#F57A6F", "Забито"];
    }
    if (value === "2") {
      return ["#F7ED81", "Сильный поток"];
    }
    return ["#bbb", value];
  };

  const [rowColor, status] = getStatusInfo(drain.status_value);

  const getDisplayTime = (time) => {
    const localtime = moment(time, "YYYY-MM-DD hh:mm:ss").add(
      moment().utcOffset(),
      "m"
    );
    return time ? localtime.calendar() : "Никогда";
  };

  const displayData = getDisplayTime(drain.status_updated_at);

  if (deleted) {
    return (
      <tr>
        <td></td>
        <td>Удалено...</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{drain.id}</td>
      <td>{drain.name}</td>
      <td>{drain.address}</td>
      <td style={{ backgroundColor: rowColor }}>{status}</td>
      <td>{displayData}</td>
      <td>
        <Button size="sm" variant="link" onClick={showHistory}>
          История
        </Button>
        {enableActions && (
          <Button size="sm" variant="link" onClick={removeDrain}>
            Удалить
          </Button>
        )}
        {historyShow && (
          <Modal show={historyShow} onHide={hideHistory} scrollable>
            <Modal.Header closeButton>
              <Modal.Title>{drain.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {enableActions && statuses && statuses.length > 0 && (
                <Button size="sm" variant="link" onClick={clearHistory}>
                  Очистить список
                </Button>
              )}

              <Table bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Статус</th>
                    <th>Обновлено</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses &&
                    statuses.map((status) => {
                      const [rowColor, statusName] = getStatusInfo(
                        status.value
                      );

                      return (
                        <tr key={`${status.id}-${status.updated_at}`}>
                          <td>{status.id}</td>
                          <td style={{ backgroundColor: rowColor }}>
                            {statusName}
                          </td>
                          <td>{getDisplayTime(status.updated_at)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {statuses && statuses.length === 0 && <p>Пусто</p>}
            </Modal.Body>
          </Modal>
        )}
      </td>
    </tr>
  );
}

export default App;
