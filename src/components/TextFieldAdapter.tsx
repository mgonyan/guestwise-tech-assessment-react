import { Form } from "react-bootstrap";
import { FieldRenderProps } from "react-final-form";

type TextFieldAdapterProps = {
  placeholder?: string;
  feedBack?: string;
  label?: string;
  required?: boolean;
} & FieldRenderProps<string, any>;

export default function TextFieldAdapter({
  label,
  placeholder = "",
  required,
  input: { name, value, onChange, type },
  meta: { invalid, error, touched },
}: TextFieldAdapterProps) {
  return (
    <Form.Group className="position-relative mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isInvalid={touched && invalid}
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
