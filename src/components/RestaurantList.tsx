import React, { useEffect, useState } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { getRestaurants } from "../services/api";
import Loader from "./Loader";
import Error from "./Error";

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { restaurants, loading, error } = useQueryRestaurants();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Container>
      <h2>Restaurants</h2>
      <ListGroup>
        {restaurants.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => onRestaurantSelect(restaurant.id)}
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;

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
