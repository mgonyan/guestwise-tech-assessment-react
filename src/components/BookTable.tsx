import { FORM_ERROR, setIn } from "final-form";
import React from "react";
import { Alert, Card, Container, Form } from "react-bootstrap";
import { Field, Form as RFForm } from "react-final-form";
import * as yup from "yup";
import SubmitButton from "./SubmitButton";
import TextFieldAdapter from "./TextFieldAdapter";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
};

type ValidationFormValues = Omit<FormValues, "date" | "time"> & {
  date: Date;
  time: Date;
};

const BookTable: React.FC = () => {
  const ukPhoneRegExp = /^(?:0|\+44)\s?\d{10}$/;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

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

  const validationSchema = yup.object<ValidationFormValues>().shape({
    name: yup.string().required(),
    email: yup.string().email("must be a valid email").required(),
    phone: yup
      .string()
      .matches(ukPhoneRegExp, "must be a valid UK number")
      .required(),
    date: yup
      .date()
      .typeError("must be a valid date")
      .min(today, "cannot be set for the past")
      .required(),
    time: yup
      .date()
      .required()
      .typeError("must be a valid time")
      .when("date", ([date]: Date[], schema: yup.DateSchema) => {
        return date
          ? schema.min(
              oneHourFromNow,
              "must be scheduled for at least 1 hour in the future"
            )
          : schema;
      }),
    guests: yup
      .number()
      .positive()
      .lessThan(13, "invalid number of guests (max is 12)")
      .required(),
  });

  const validateFormValuesWithSchema =
    (schema: yup.ObjectSchema<ValidationFormValues>) =>
    async (values: FormValues) => {
      try {
        const bookingDate = new Date(
          `${values.date}${values.time ? `T${values.time}` : ""}`
        );
        await schema.validate(
          { ...values, date: new Date(values.date), time: bookingDate },
          { abortEarly: false }
        );
      } catch (err) {
        const errors = (err as yup.ValidationError).inner.reduce(
          (formError, innerError) => {
            return setIn(formError, innerError.path || "", innerError.message);
          },
          {}
        );

        return errors;
      }
    };

  return (
    <Container>
      <Card className="shadow">
        <Card.Body>
          <Card.Title>
            <h3 className="form-items">Book a Table</h3>
          </Card.Title>
          <RFForm<FormValues>
            validate={validateFormValuesWithSchema(validationSchema)}
            onSubmit={onSubmit}
          >
            {({
              handleSubmit,
              valid,
              hasSubmitErrors,
              submitErrors,
              submitSucceeded,
              submitting,
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
        </Card.Body>
      </Card>
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
