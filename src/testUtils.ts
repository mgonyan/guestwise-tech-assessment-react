export const createRestaurantData = ({
  id,
  name,
  description,
  address,
  score,
  contactEmail,
}: {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  contactEmail?: string;
  score?: number;
}) => ({
  id,
  name,
  shortDescription: description,
  cuisine: "French",
  rating: score ?? 4.7,
  details: {
    id: 1,
    address: address ?? "123 Fine St, London",
    openingHours: {
      weekday: "12:00 PM - 10:00 PM",
      weekend: "11:00 AM - 11:00 PM",
    },
    reviewScore: score ?? 4.7,
    contactEmail: contactEmail ?? "info@gourmetkitchen.com",
  },
});
