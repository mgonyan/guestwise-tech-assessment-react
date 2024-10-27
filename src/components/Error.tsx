import { Alert } from "react-bootstrap";

export default function Error({ message }: { message: string }) {
  return <Alert variant="danger">{message}</Alert>;
}
