import { Form } from 'react-bootstrap';
import './LoaderStyle.scss';
function Input({ props, errors, label, required }, ref) {

    return (
        <Form.Group className="form-group mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>
                {label}
                {required &
                    <span className="text-danger small">*</span>}
            </Form.Label>
            <Form.Control
                ref={ref}
                {...props}
            />
            {errors?.phoneEmail &&
                <span className="text-danger small position-absolute">
                    {errors?.phoneEmail?.message}
                </span>
            }
        </Form.Group>
    )
}

export default Input;
