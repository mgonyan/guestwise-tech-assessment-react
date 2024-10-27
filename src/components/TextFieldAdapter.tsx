import { Form } from "react-bootstrap";
import { FieldRenderProps } from "react-final-form";

type TextFieldAdapterProps = {
  placeholder?: string;
  label?: string;
} & FieldRenderProps<string, any>;

export default function TextFieldAdapter({
  label,
  placeholder = "",
  input: { name, value, onChange, type },
}: TextFieldAdapterProps) {
  return (
    <Form.Group className="position-relative mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
}
