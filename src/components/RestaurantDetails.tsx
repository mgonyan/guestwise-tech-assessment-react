import React, { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import Loader from "./Loader";
import Error from "./Error";
import { getRestaurantDetails } from "../services/api";

type RestaurantDetailsProps = {
  restaurantId: number;
  onGoBack: () => void;
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
  onGoBack,
}) => {
  const { details, loading, error } = useQueryRestaurantDetails(restaurantId);

  if (!restaurantId) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          {error ? (
            <Error message={error} />
          ) : (
            <>
              <Card.Title>Restaurant Details</Card.Title>
              <Card.Text>Address: {details?.address}</Card.Text>
              <Card.Text>Review Score: {details?.reviewScore}</Card.Text>
              <Card.Text>Contact: {details?.contactEmail}</Card.Text>
            </>
          )}
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => onGoBack()}
          >
            {"<"} Back
          </Button>
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
