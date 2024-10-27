import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetails from "./components/RestaurantDetails";
import BookTable from "./components/BookTable";

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);

  if (selectedRestaurantId) {
    return (
      <Container className="m-3">
        <Row>
          <Col md={4}>
            <RestaurantDetails
              restaurantId={selectedRestaurantId}
              onGoBack={() => setSelectedRestaurantId(null)}
            />
          </Col>
          <Col md={8}>
            <BookTable />
          </Col>
        </Row>
      </Container>
    );
  }

  return <RestaurantList onRestaurantSelect={setSelectedRestaurantId} />;
}

export default App;
