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

import "./styles.css";

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <TodoListCard />
        </Col>
      </Row>
    </Container>
  );
}

const apiurl = "http://172.20.24.143:5000";

function TodoListCard() {
  const [drains, setDrains] = React.useState(null);

  const fetchDrainsDisplay = () => {
    fetch(apiurl + "/drains/display")
      .then((r) => r.json())
      .then(setDrains);
  };

  React.useEffect(() => {
    fetchDrainsDisplay();
    setInterval(fetchDrainsDisplay, 5000);
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
      <AddDrainForm onNewDrain={onNewDrain} />
      <Container fluid>
        <Row>
          <Col>
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
          </Col>
        </Row>
      </Container>
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
    console.log(JSON.stringify({ name: drainName, address: drainAddress }));
    fetch(apiurl + "/drains", {
      method: "POST",
      body: JSON.stringify({ name: drainName, address: drainAddress }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((drain) => {
        console.log(drain);
        onNewDrain(drain);
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

function DrainDisplay({ drain, onDrainUpdate, onDrainRemoval }) {
  const removeDrain = () => {
    fetch(apiurl + `/drains/${drain.id}`, { method: "DELETE" }).then(() =>
      onDrainRemoval(drain)
    );
  };

  let rowColor = "transparent";
  let status = "Чисто";
  if (!drain.status_value) {
    status = "Неизвестно";
  }
  if (drain.status_value === "full") {
    rowColor = "#F57A6F";
    status = "Забито полностью";
  }
  if (drain.status_value === "half") {
    rowColor = "#F7ED81";
    status = "Забито наполовину";
  }

  const displayData = drain.status_updated_at
    ? moment(drain.status_updated_at, "YYYY-MM-DD hh:mm:ss")
        .locale("ru")
        .calendar()
    : "Никогда";

  return (
    <tr>
      <td>{drain.id}</td>
      <td>{drain.name}</td>
      <td>{drain.address}</td>
      <td style={{ backgroundColor: rowColor }}>{status}</td>
      <td>{displayData}</td>
      <td>
        <Button
          size="sm"
          variant="link"
          onClick={removeDrain}
          aria-label="Remove Item"
        >
          <i className="fa fa-trash text-danger" />
          Удалить
        </Button>
      </td>
    </tr>
  );
}

export default App;
