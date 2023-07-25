import Form from "react-bootstrap/Form";
import _ from "lodash";
import { ChangeEvent, useState } from "react";

type FormLabelControlProps = {
    label: string;
    type?: string,
    onChange?: (event: ChangeEvent) => void;
}

const FormLabelControl: React.FC<FormLabelControlProps> = ({ label, type, onChange }) => {
    const [controlValue, setControlValue] = useState<string>("");

    function handleChange(event: ChangeEvent) {
        const { value } = event.target as HTMLInputElement;

        setControlValue(value);
        onChange && onChange(event);
    }

    return <>
        <Form.Group className="mb-3">
            <Form.Label data-cy="label">{label}</Form.Label>
            <Form.Control
                name={_.lowerCase(label)}
                type={type ? type : _.lowerCase(label)}
                placeholder={label}
                onChange={handleChange}
                value={controlValue}
                required
                data-cy="control"
            />
        </Form.Group>
    </>;
}

export default FormLabelControl;