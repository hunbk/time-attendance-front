import Form from "react-bootstrap/Form";
import _ from "lodash";
import { ChangeEvent, useState, FC } from "react";

type FormLabelControlProps = {
    label: string;
    type?: string,
    onChange?: (event: ChangeEvent) => void;
}

const FormLabelControl: FC<FormLabelControlProps> = ({ label, type, onChange }) => {
    const [controlValue, setControlValue] = useState<string>("");

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;

        setControlValue(value);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onChange && onChange(event);
    }

    return <>
        <Form.Group className="mb-3">
            <Form.Label data-cy="label">{label}</Form.Label>
            <Form.Control
                name={label === "Phone" ? "phoneNumber" : _.lowerCase(label)}
                type={type === "password" ? "password" : "text"}
                placeholder={label}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={handleChange}
                value={controlValue}
                required
                data-cy="control"
            />
        </Form.Group>
    </>;
}

export default FormLabelControl;