import clientRequest from "../../APIFeatures/clientRequest";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useEffect, useState } from "react";
import {
  getFormattedDate,
  formattedDateFromParse,
} from "../../HandlerCaculate/formatDate";
import Modal from "react-awesome-modal";

const DiscountDetail = (props) => {
  const [discount, setDiscount] = useState();
  const [openModal, setOpenModal] = useState(false);
  useEffect(async () => {
    if (props.match.path == "/discount/:id") {
      const res = await clientRequest.getDiscountDetail(props.match.params.id);
      setDiscount(res.discount);
    }
  }, []);
  const convertDate = (date) => {
    const d = new Date(date);
    return Date.parse(d);
  };
  const submitHanddler = async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementsByName("name")[0].value,
      categoryProduct: document.getElementsByName("categoryProduct")[0].value,
      validDate: convertDate(document.getElementsByName("validDate")[0].value),
      quantity: Number(document.getElementsByName("quantiy")[0].value),
      value: Number(document.getElementsByName("value")[0].value),
    };
    console.log(data);
    if (
      !data.name ||
      !data.categoryProduct ||
      !data.validDate ||
      !data.quantity ||
      !data.value
    ) {
      NotificationManager.error("Error", "Please enter full information");
      return;
    }

    const date = new Date();
    if (data.validDate <= date.getTime()) {
      NotificationManager.error(
        "Error",
        "Please enter the code that expires after the current date "
      );
      return;
    }
    const list = await clientRequest.getListDiscount(
      document.getElementsByName("name")[0].value
    );
    if (list.discounts.length != 0) {
      NotificationManager.error(
        "Error",
        "The name is already the same, please change the name "
      );
      return;
    }
    await clientRequest
      .createDiscount(data)
      .then((res) => NotificationManager.success("Success", "Create Success"));
  };
  const removeDiscountItem = async () => {
    await clientRequest
      .removeDiscount(discount._id)
      .then((res) => {
        NotificationManager.success("Success", "Remove Success");
        window.location.href = "/discounts";
      })
      .catch((err) => NotificationManager.error("Error", "Remove failed"));
  };

  const updateDiscountItem = async () => {
    const data = document.getElementsByName("addStock")[0].value;
    await clientRequest.updateStock(discount._id, data).then((res) => {
      NotificationManager.success("success", "success");
      setOpenModal(false);
    });
  };
  const ModalStock = () => {
    return (
      <Modal
        visible={openModal}
        width="400"
        height="300"
        effect="fadeInUp"
        onClickAway={() => setOpenModal(false)}
      >
        {" "}
        <div className="popup-tazas text-center">
          <div style={{ margin: "auto" }}>
            <h6>Update stock</h6>
            <input placeholder="Input quantity" name="addStock" />
            <div className="btn-group btn">
              <button
                className="btn btn-success"
                onClick={() => updateDiscountItem()}
              >
                Update
              </button>
              <button className="btn">
                <a
                  href="javascript:void(0);"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </a>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  return (
    <div className="row">
      <div className="col-md-6">
        <form onSubmit={submitHanddler}>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">Mã giảm giá</label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              defaultValue={discount && discount.name}
              name="name"
              disabled={props.match.path == "/discount/:id"}
            />
          </div>
          <div className="form-group col-md-4">
            <label>Danh mục</label>
            <select
              disabled={props.match.path == "/discount/:id"}
              className="form-control"
              // name="category"
              value={discount && discount.categoryProduct}
              name="categoryProduct"
            >
              <option value={"breadStickyRice"} selected>Bánh mì & Xôi</option>
              <option value={"vegetarianFood"}>Đồ chay & Thức ăn dinh dưỡng</option>
              <option value={"brokenRice"}>Cơm & Cơm tấm</option>
              <option value={"noodleCongee"}>Bún/Phở/Mì & Cháo</option>
              <option value={"seafood"}>Seafood</option>
              <option value={"hotpotBarbecue"}>Lẩu & Đồ nướng</option>
              <option value={"dessert"}>Tráng miệng</option>
              <option value={"beer"}>Bia & Rượu</option>
              <option value={"softDrink"}>Sinh tố & Nước ngọt</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput2">Ngày hết hạn:   </label>
            {props.match.path == "/admin/create-discount" && (
              <input
                type="date"
                id="start"
                name="validDate"
                defaultValue={Date.now()}
                min="2018-01-01"
                max="2099-12-31"
              />
            )}
            {discount && props.match.path == "/discount/:id" && (
              <span>{formattedDateFromParse(discount.validDate)}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput2">Số lượng</label>
            <input
              disabled={props.match.path == "/discount/:id"}
              type="number"
              min={1}
              className="form-control"
              id="formGroupExampleInput2"
              defaultValue={discount && discount.quantity}
              name="quantiy"
            />
          </div>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput2">Giá trị giảm (%)</label>
            <input
              disabled={props.match.path == "/discount/:id"}
              type="number"
              min={1}
              max={100}
              className="form-control"
              id="formGroupExampleInput2"
              defaultValue={discount && discount.value}
              name="value"
            />
          </div>
          {props.match.path == "/admin/create-discount" && (
            <button type="submit">Tạo mã giảm giá</button>
          )}
        </form>
        {/* {props.match.path=="/admin/discount/:id"&&<button onClick={()=>setOpenModal(true)}>Update Stock</button>} */}

        <NotificationContainer />
        <ModalStock />
      </div>
    </div>
  );
};
export default DiscountDetail;
