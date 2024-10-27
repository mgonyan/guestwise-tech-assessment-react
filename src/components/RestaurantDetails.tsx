import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import Loader from "./Loader";
import Error from "./Error";
import { getRestaurantDetails } from "../services/api";

type RestaurantDetailsProps = {
  restaurantId: number;
};

type RestaurantDetailsData = {
  address: string;
  openingHours: {
    weekday: string;
    weekend: string;
  };
  reviewScore: number;
  contactEmail: string;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurantId,
}) => {
  const { details, loading, error } = useQueryRestaurantDetails(restaurantId);

  if (!restaurantId) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Restaurant Details</Card.Title>
          <Card.Text>Address: {details?.address}</Card.Text>
          <Card.Text>Review Score: {details?.reviewScore}</Card.Text>
          <Card.Text>Contact: {details?.contactEmail}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;

export const useQueryRestaurantDetails = (
  restaurantId: number
): {
  details: RestaurantDetailsData | null;
  loading: boolean;
  error?: string;
} => {
  const [data, setDetails] = useState<RestaurantDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurantDetails() {
      setLoading(true);
      try {
        const { details }: { details: RestaurantDetailsData } =
          await getRestaurantDetails(restaurantId);
        setDetails(details);
      } catch (error) {
        setError(
          `Error fetching restaurant details: ${(error as Error).message}`
        );
      }

      setLoading(false);
    }

    if (restaurantId > 0) {
      fetchRestaurantDetails();
    }
  }, [restaurantId]);

  return { details: data, loading, error };
};
