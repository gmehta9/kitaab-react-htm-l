import { Modal } from "react-bootstrap";


function SellBuyOrderDetail({ type, data, modalShow, setModalShow }) {
    console.log(data);
    return (
        <>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter">
                <span onClick={() => setModalShow(undefined)}>close</span>
                <Modal.Body>
                    <p>
                        Work in progress...
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={props.onHide}>Close</Button> */}
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default SellBuyOrderDetail;