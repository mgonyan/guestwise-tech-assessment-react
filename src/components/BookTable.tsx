import { FORM_ERROR } from "final-form";
import React from "react";
import { Alert, Container, Form } from "react-bootstrap";
import { Field, Form as RFForm } from "react-final-form";
import TextFieldAdapter from "./TextFieldAdapter";
import SubmitButton from "./SubmitButton";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
};

const BookTable: React.FC = () => {
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (!response.ok) {
        return {
          [FORM_ERROR]: "Booking failed",
        };
      }
    } catch (err) {
      return {
        [FORM_ERROR]: `Something went wrong: "${err}"`,
      };
    } finally {
    }
  };

  return (
    <Container>
      <h2>Book a Table</h2>
      <RFForm<FormValues> onSubmit={onSubmit}>
        {({
          handleSubmit,
          valid,
          submitSucceeded,
          submitting,
          hasSubmitErrors,
          submitErrors,
        }) => (
          <Form noValidate validated={valid} onSubmit={handleSubmit}>
            <Field
              name="name"
              component={TextFieldAdapter}
              label="Name"
              required
            />
            <Field
              name="email"
              component={TextFieldAdapter}
              label="Email"
              type="email"
              required
            />
            <Field
              name="phone"
              type="tel"
              component={TextFieldAdapter}
              label="Phone"
              required
            />
            <Field
              name="date"
              type="date"
              component={TextFieldAdapter}
              label="Date"
              required
            />
            <Field
              name="time"
              type="time"
              component={TextFieldAdapter}
              label="Time"
            />
            <Field
              name="guests"
              type="number"
              component={TextFieldAdapter}
              label="Guests"
              required
            />
            {hasSubmitErrors && submitErrors && (
              <SubmitErrors errors={submitErrors} />
            )}
            {submitSucceeded && (
              <Alert variant="success" className="my-3">
                Booking successful
              </Alert>
            )}
            <SubmitButton submitting={submitting} text="Book" />
          </Form>
        )}
      </RFForm>
    </Container>
  );
};

export default BookTable;

function SubmitErrors({ errors }: { errors: object }) {
  return (
    <Alert variant="danger" className="my-3">
      <ul>
        {Object.values(errors).map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
}
