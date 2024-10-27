import { Button, Spinner } from "react-bootstrap";

export default function SubmitButton({
  submitting,
  text,
}: {
  submitting: boolean;
  text: string;
}) {
  return (
    <Button variant="primary" type="submit" disabled={submitting}>
      {submitting ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          Submitting...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
