import React, { useEffect, useState } from "react";
import {
  ListGroup,
  Container,
  Alert,
  Card,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { getRestaurants } from "../services/api";
import Loader from "./Loader";
import Error from "./Error";

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

type SortOptions = "name-asc" | "name-desc" | "max-rating" | "min-rating";

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { restaurants, loading, error } = useQueryRestaurants();

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOptions>("name-asc");

  const filteredRestaurants =
    loading || !restaurants
      ? []
      : restaurants.filter(({ name }: Restaurant) =>
          name.toLowerCase().includes(filter.toLowerCase())
        );

  const filteredAndSortedRestaurants = filteredRestaurants.sort(
    (a: Restaurant, b: Restaurant) => {
      if (sortBy === "name-desc") {
        return a.name.localeCompare(a.name);
      }
      if (sortBy === "max-rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "min-rating") {
        return a.rating - b.rating;
      }

      return a.name.localeCompare(b.name);
    }
  );

  const handleResetFilters = () => {
    setFilter("");
    setSortBy("name-asc");
  };

  return (
    <Container className="m-3">
      <Row>
        <Col md={4}>
          <RestaurantListMenu
            filter={filter}
            sortBy={sortBy}
            onFilterChange={setFilter}
            onSortByChange={setSortBy}
            onResetFilters={handleResetFilters}
          />
        </Col>
        <Col md={8}>
          <Restaurants
            loading={loading}
            error={error}
            restaurants={filteredAndSortedRestaurants}
            onRestaurantSelect={onRestaurantSelect}
            onResetFilters={handleResetFilters}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantList;

function RestaurantListMenu({
  filter,
  sortBy,
  onFilterChange,
  onSortByChange,
  onResetFilters,
}: {
  filter: string;
  sortBy: string;
  onFilterChange: (value: string) => void;
  onSortByChange: (value: SortOptions) => void;
  onResetFilters: () => void;
}) {
  const showClearFilter = filter.length > 0 || sortBy !== "name-asc";

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortByChange(event.target.value as SortOptions);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(event.target.value);
  };

  const handleClearFilter = () => {
    onResetFilters();
  };

  return (
    <Card className="shadow">
      <Card.Body>
        <Card.Title>Restaurants</Card.Title>
        <Form.Group controlId="filterInput" className="mb-3">
          <Form.Label>Filter Restaurant</Form.Label>
          <Form.Control
            type="text"
            placeholder="Type restaurant name..."
            value={filter}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group controlId="sortByInput" className="mb-3">
          <Form.Label>Sort By</Form.Label>
          <Form.Select onChange={handleSortByChange} value={sortBy}>
            <option value="name-asc">Name - Asc</option>
            <option value="name-desc">Name - Desc</option>
            <option value="max-rating">Max Rating</option>
            <option value="min-rating">Min Rating</option>
          </Form.Select>
        </Form.Group>
        {showClearFilter && (
          <Card.Link onClick={handleClearFilter}>Clear filters</Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

function Restaurants({
  loading,
  error,
  restaurants,
  onRestaurantSelect,
  onResetFilters,
}: {
  loading: boolean;
  error?: string;
  restaurants?: Restaurant[];
  onRestaurantSelect: (id: number) => void;
  onResetFilters: () => void;
}) {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!loading && !error && restaurants?.length === 0) {
    return (
      <Alert>
        There are not results. Try to{" "}
        <span
          onClick={() => onResetFilters()}
          className="text-primary"
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          reset
        </span>{" "}
        the filters
      </Alert>
    );
  }

  return (
    <ListGroup role="list" aria-label="restaurants">
      {restaurants?.map((restaurant) => (
        <ListGroup.Item
          key={restaurant.id}
          action
          role="listitem"
          aria-label={restaurant.name}
          onClick={() => onRestaurantSelect(restaurant.id)}
        >
          <h5>{restaurant.name}</h5>
          <p>{restaurant.shortDescription}</p>
          <p>Rating: {restaurant.rating}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

const useQueryRestaurants = (): {
  restaurants: Restaurant[];
  loading: boolean;
  error?: string;
} => {
  const [rs, setRestaurants] = useState<Restaurant[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const data: Restaurant[] = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        setError(`Error fetching restaurants: ${(error as Error).message}`);
      }

      setLoading(false);
    }

    fetchRestaurants();
  }, []);

  return { restaurants: rs || [], loading, error };
};
