import { useEffect } from "react";
import clientRequest from "../../../APIFeatures/clientRequest";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useContext } from "react";
import { TransactionContext } from "../../../context/TransactionContext";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "../cart/CartItems.css";
import {
  compareValidDate,
  formatterMoney,
  validateCityOrPostalCode,
  validatePhoneNumber,
} from "../../../HandlerCaculate/formatDate";
import { Link } from "react-router-dom";
import { connect } from "mongoose";
import ModalComponent from "../../shared/ModalComponent";
// import Cards from 'react-credit-cards';
// import 'react-credit-cards/es/styles-compiled.css';
// import { useStripe,useElements,CardElement,CardNumberElement} from '@stripe/react-stripe-js';
const CartItems = (props) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [itemsPrice, setItemsPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(2);
  const [order, setOrder] = useState({});
  const [openFormETH, setOpenFormETH] = useState(false);
  const [isConnectWallet, setIsConnectWallet] = useState(false);
  const [creditInput, setCreditInput] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const [crypto, setCrypto] = useState({
    BTC: 0,
    ETH: 0,
    EUR: 0,
    USD: 0,
  });
  const {
    connectWallet,
    currentAccount,
    formData,
    setFormData,
    handleChange,
    sendTransaction,
    connectSmartContract,
  } = useContext(TransactionContext);
  const [searchDiscount, setSearchDiscount] = useState("");
  const [stDiscount, setStDiscount] = useState();

  useEffect(async () => {
    fetchMyAPI();
    if (props.match.path == "/order/create-new") {
      var list = [];
      var temp = JSON.parse(localStorage.getItem("cartItem"));
      temp.quantity = 1;
      temp.total = temp.price * temp.quantity;
      temp.checked = true;
      temp.product = temp._id;
      list.push(temp);
      setCartItems(list);
    } else {
      const cart = await clientRequest.getCart();
      setCartItems(cart.myCart);
    }
    setIsConnectWallet(connectWallet());
  }, []);
  function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
  
    return false;
  }

  // console.log("day",isPromise(isConnectWallet))

  useEffect(() => {
    var total = cartItems.reduce(function (acc, item) {
      if (item.checked) {
        if (stDiscount && stDiscount.categoryProduct == item.category) {
          return (
            acc +
            (item.quantity * item.price -
              item.quantity * item.price * stDiscount.value * 0.01)
          );
        }
        return acc + item.quantity * item.price;
      }
      return acc;
    }, 0);
    var tax = total * 0.1;
    setItemsPrice(Math.round((total + Number.EPSILON) * 100) / 100);
    setTaxPrice(Math.round((tax + Number.EPSILON) * 100) / 100);
    setTotalPrice(
      Math.round((total + tax + shippingPrice + Number.EPSILON) * 100) / 100
    );
  }, [cartItems, stDiscount]);
  function changeUSDtoETH(money) {
    return (((money / crypto.USD) * crypto.ETH * 100) / 100).toFixed(3);
  }
  async function fetchMyAPI() {
    clientRequest.getCryptoCompare().then((res) => {
      setCrypto({ ...res });
    });
    const cart = await clientRequest.getProfileMe();
    setUser(cart.user);
  }
  const updateCartChanged = (index) => (e) => {
    let newArr = [...cartItems];
    newArr[index].quantity = Number(e.target.value);
    newArr[index].total = Number(
      Math.round(
        (e.target.value * newArr[index].price + Number.EPSILON) * 100
      ) / 100
    );
    setCartItems(newArr);
  };
  const removeItem = (id) => {
    const cartFilter = cartItems.filter((item) => item._id != id);
    clientRequest
      .updateCartItem(id)
      .then((res) => NotificationManager.success("success", "update success"));
    setCartItems(cartFilter);
  };
  const handleChecked = (index) => (e) => {
    let newArr = [...cartItems];
    newArr[index].checked = e.currentTarget.checked;
    setCartItems(newArr);
  };

  const handleSubmit = () => {
    const orderItems = cartItems.filter((item) => item.checked);
    const data = {
      shippingInfo: {
        address: document.getElementsByName("address")[0].value,
        city: document.getElementsByName("city")[0].value,
        phoneNo: document.getElementsByName("phoneNo")[0].value,
        postalCode: document.getElementsByName("postalCode")[0].value,
        country: document.getElementsByName("country")[0].value,
      },
      user: user._id,
      orderItems,
      itemsPrice: Number(itemsPrice),
      totalPrice: Number(totalPrice),
      shippingPrice: Number(shippingPrice),
      taxPrice: Number(taxPrice),
      orderStatus: "Processing",
      discountId: stDiscount ? stDiscount._id : null,
    };
    if (
      !data.shippingInfo.address ||
      !data.shippingInfo.city ||
      !data.shippingInfo.phoneNo ||
      !data.shippingInfo.postalCode ||
      !data.shippingInfo.country
    ) {
      NotificationManager.error("Error", "Infor not empty");
      return;
    }
    if (!validatePhoneNumber(data.shippingInfo.phoneNo)) {
      NotificationManager.error("Error", "The phone number invalid");
      return;
    }
    if (!validateCityOrPostalCode(data.shippingInfo.postalCode)) {
      NotificationManager.error("Error", "Postal code invalid");
      return;
    }
    if (data.orderItems.length == 0) {
      NotificationManager.error("Error", "Products not marked");
      return;
    }
    clientRequest
      .postOrder(data)
      .then((res) => {
        NotificationManager.success("Success", "Create order complete");
        // const link = "/order/me/" + res.order._id;
        // window.location.href = link;
      })
      .catch((err) =>
        NotificationManager.error("Error", "Cannot create order")
      );
  };
  const checkValid = async () => {
    const orderItems = cartItems.filter((item) => item.checked);
    const data = {
      shippingInfo: {
        address: document.getElementsByName("address")[0].value,
        city: document.getElementsByName("city")[0].value,
        phoneNo: document.getElementsByName("phoneNo")[0].value,
        postalCode: document.getElementsByName("postalCode")[0].value,
        country: document.getElementsByName("country")[0].value,
      },
      user: user._id,
      orderItems,
      itemsPrice: Number(itemsPrice),
      totalPrice: Number(totalPrice),
      shippingPrice: Number(shippingPrice),
      taxPrice: Number(taxPrice),
      orderStatus: "Processing",
      discountId: stDiscount ? stDiscount._id : null,
    };
    if (
      !data.shippingInfo.address ||
      !data.shippingInfo.city ||
      !data.shippingInfo.phoneNo ||
      !data.shippingInfo.postalCode ||
      !data.shippingInfo.country
    ) {
      NotificationManager.error("Error", "Infor not empty");
      return;
    }
    if (!validatePhoneNumber(data.shippingInfo.phoneNo)) {
      NotificationManager.error("Error", "The phone number invalid");
      return;
    }
    if (!validateCityOrPostalCode(data.shippingInfo.postalCode)) {
      NotificationManager.error("Error", "Postal code invalid");
      return;
    }
    if (data.orderItems.length == 0) {
      NotificationManager.error("Error", "Products not marked");
      return;
    }
    try {
      const transaction = await sendTransaction();
      console.log(transaction)
      if (transaction) {
        const transactionEthereum = {
          from: transaction["from"],
          hash: transaction["transaction"]["transactionHash"],
          value: formData["amount"],
          to: formData["address"],
          keyword: formData["keyword"],
          message: formData["message"],
        };
        data["transactionEthereum"] = transactionEthereum;
        clientRequest
            .postOrder(data)
            .then((res) => {
              NotificationManager.success("Success", "Create order complete");
              const link = "/order/me/" + res.order._id;
              window.location.href = link;
            })
            .catch((err) =>
                console.log(err)
            );
      }

    } catch (error) {
      console.log(error);
    }
  };
  const [address, setAddress] = useState("");
  const FormEthereum = () => {
    return (
      <>
        <div className="form-transaction ">
          <label style={{ width: "83.333%", textAlign: "left" }}>
            Address to:
          </label>
          <input
            placeholder="Address To"
            className="input_transaction col-10"
            name="address"
            defaultValue={formData.address}
            disabled
          ></input>
          <label style={{ width: "83.333%", textAlign: "left" }}>
            Amount(ETH):
          </label>

          <input
            placeholder="Amount (ETH)"
            name="amount"
            className="input_transaction col-10"
            defaultValue={formData.amount}
            onBlur={(e) => handleChange(e, "amount")}
            disabled
          ></input>
          <label style={{ width: "83.333%", textAlign: "left" }}>
            Keyword(Gif):
          </label>

          <input
            placeholder="Keyword (Gif)"
            name="keyword"
            className="input_transaction col-10"
            defaultValue={formData.keyword}
            onBlur={(e) => handleChange(e, "keyword")}
          ></input>
          <label style={{ width: "83.333%", textAlign: "left" }}>
            Message:
          </label>

          <input
            placeholder="Enter Message"
            name="message"
            className="input_transaction col-10"
            defaultValue={formData.message}
            onBlur={(e) => handleChange(e, "message")}
          ></input>
        </div>
      </>
    );
  };
  const applyCode = async (e) => {
    const res = await clientRequest.getDiscount(searchDiscount).catch((err) => {
      NotificationManager.error(
        "error",
        "Discount code does not exist or has been used "
      );
      setStDiscount(null);
    });

    if (res) {
      if (res.discount.quantity == 0) {
        NotificationManager.error("error", "No more discount codes");
        setStDiscount(null);
        return;
      }
      if (!compareValidDate(res.discount.validDate)) {
        NotificationManager.error("error", "Code expired");
        setStDiscount(null);
        return;
      }
      NotificationManager.success("success", "Apply success");
      setStDiscount(res.discount);
    }
  };

  function renderButton() {
    if (isConnectWallet == false ) {
      return (
        <button
          style={{
            borderRadius: "22px",
            fontWeight: "700",
            fontFamily: "inherit",
            margin: "17px 10px",
            color: "#fff",
          }}
          className="btn btn-success  mt-2"
          onClick={() => {
            setIsConnectWallet(connectWallet());
          }}
        >
          connect Wallet
        </button>
      );
    }
    if (isConnectWallet ) {
      return (
        <button
          style={{
            borderRadius: "22px",
            fontWeight: "700",
            fontFamily: "inherit",
            margin: "17px 10px",
            color: "#fff",
          }}
          className="btn btn-success  mt-2"
          onClick={(e) => {
            setIsShowModal(!isShowModal);
            e.target.value = changeUSDtoETH(totalPrice);
            handleChange(e, "amount");
            // connectSmartContract()
          }}
        >
          Thanh toán qua ethereum
        </button>
      );
    }
  }
  return (
    <>
      <div style={{ height: "80px" }}></div>
      <div className="">
        <div className="row mt-2">
          <div className="col-md-9">
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems &&
                    cartItems.map((item, index) => {
                      return (
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              defaultChecked={item.checked}
                              onChange={handleChecked(index)}
                            />
                          </td>
                          <td>{item.name}</td>
                          {item.images && (
                            <td>
                              <img
                                src={item.images[0].url}
                                style={{ height: "100px" }}
                              />
                            </td>
                          )}
                          {item.image && (
                            <td>
                              <Link to={`/product/${item.product}`}>
                                <img
                                  src={item.image}
                                  style={{ height: "100px" }}
                                />
                              </Link>
                            </td>
                          )}
                          <td>
                            {" "}
                            <input
                              defaultValue={item.quantity}
                              type="Number"
                              min={1}
                              onChange={updateCartChanged(index)}
                            />
                          </td>
                          <td>{item.price}</td>
                          <td>{item.total}</td>

                          <td>
                            <button
                              className="btn btn-danger fas fa-trash"
                              onClick={() => removeItem(item._id)}
                            ></button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-md-3">
            {user && (
              <div className="user-cart-items">
                <div
                  style={{
                    height: "150px",
                    width: "150px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "1px 1px 10px #00000036",
                  }}
                >
                  <img src={user.avatar.url} />
                </div>
                <div className="row">
                  <div className="col-md-4">Name</div>
                  <div className="col-md-8">{user.name}</div>
                  <div className="col-md-4">Email</div>
                  <div className="col-md-8">{user.emailUser}</div>
                </div>
              </div>
            )}
            <form>
              <div className="form-group">
                <label htmlFor="exampleInputAddress">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputAddress"
                  placeholder="Enter address"
                  name="address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputCity">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputCity"
                  placeholder="City"
                  name="city"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPhoneNo">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputPhoneNo"
                  placeholder="Phone number"
                  name="phoneNo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPostal">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputPostal"
                  placeholder="Postal code"
                  name="postalCode"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputCountry">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputCountry"
                  placeholder="Country"
                  name="country"
                />
              </div>
            </form>
            <div
              className="container"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 3px 8px",
                borderRadius: "4px",
              }}
            >
              <div className="lh-lg">
                <span>Items Price:</span>
                <span>
                  {formatterMoney.format(itemsPrice)}{" "}
                  {stDiscount && <span>(-{stDiscount.value}%)</span>}
                </span>
              </div>
              <div className="lh-lg">
                <span>Discount Code: </span>
                <span>
                  <input
                    placeholder="Nhập mã khuyến mãi"
                    onChange={(e) => setSearchDiscount(e.currentTarget.value)}
                  />
                </span>
                <span>
                  <button
                    disabled={searchDiscount == "" ? true : false}
                    onClick={() => applyCode()}
                  >
                    Apply code
                  </button>
                </span>
                {stDiscount && (
                  <p style={{ color: "green" }}>
                    Áp dụng cho thể loại : {stDiscount.categoryProduct}
                  </p>
                )}
              </div>
              <div className="lh-lg">
                <span>Shipping Price:</span>
                <span>{formatterMoney.format(shippingPrice)}</span>
              </div>
              <div className="lh-lg">
                <span>Tax Price:</span>
                <span>{formatterMoney.format(taxPrice)}</span>
              </div>
              <div className="lh-lg">
                <span>Total Price:</span>
                <span>{formatterMoney.format(totalPrice)}</span>
              </div>
              <div className="lh-lg">
                <span>ETH:</span>
                <span>{changeUSDtoETH(totalPrice)} ETH</span>
              </div>
            </div>

            <div className="">
              <button
                style={{
                  borderRadius: "22px",
                  fontWeight: "700",
                  fontFamily: "inherit",
                }}
                className="btn btn-primary  mt-2"
                onClick={() => handleSubmit()}
              >
                Order Now
              </button>
              {renderButton()}
            </div>
          </div>
        </div>
        <ModalComponent
          open={isShowModal}
          form={<FormEthereum />}
          submit={checkValid}
        />
        <NotificationContainer />
      </div>
    </>
  );
};
export default CartItems;
