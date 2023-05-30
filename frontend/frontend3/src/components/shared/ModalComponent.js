import Modal from "react-awesome-modal";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./ModalPopup.css";
const ModalComponent = (props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(props.open);
  }, [props.open]);
  const openModal = () => {
    setVisible(true);
    props.handleChange();
  };
  const closeModal = () => {
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      width="400"
      height="600"
      effect="fadeInUp"
      onClickAway={() => closeModal()}
    >
      {" "}
      <div className="popup-tazas text-center">
        <div style={{}}>
          {props.form}

          <div className="col-12 mt-4">
            <div className="btn btn-transaction">
              <a href="javascript:void(0);" onClick={() => props.submit()}>
                Send Transaction
              </a>
            </div>
            <div className="btn btn-cancel">
              <a href="javascript:void(0);" onClick={() => closeModal()}>
                Close
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalComponent;
