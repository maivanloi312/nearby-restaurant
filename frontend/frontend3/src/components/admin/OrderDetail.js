import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import clientRequest from "../../APIFeatures/clientRequest";
import { TransactionContext } from "../../context/TransactionContext";
import ModalComponent from "../shared/ModalComponent";
import {
  formatterMoney,
  getFormattedDate,
} from "./../../HandlerCaculate/formatDate";
import ModalPopup from "./../shared/ModalPopup";
import "../../css/Detail.css";
import {
  Stepper,
  Step,
  useStepper,
  StepNumber,
  StepTitle,
  StepStatus,
  StepDescription,
} from "react-progress-stepper";
const OrderDetail = (props) => {
  const {
    connectWallet,
    currentAccount,
    formData,
    setFormData,
    handleChange,
    sendTransaction,
  } = useContext(TransactionContext);

  const [order, setOrder] = useState({});
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [openFormETH, setOpenFormETH] = useState(false);
  const [tableItems, setTableItems] = useState();
  const [discount, setDiscount] = useState();
  const [crypto, setCrypto] = useState({
    BTC: 0,
    ETH: 0,
    EUR: 0,
    USD: 0,
  });
  const [transactionEthereum, setTransactionEhthereum] = useState();
  // const { step, incrementStep, decrementStep,goToStep } = useStepper(0, 3);
  const themeStepper={
    light: {
      step: {
        pending: {
          background: "#ededed",
          color: "#a1a3a7",
        },
        progress: {
          background: "#3c3fed",
          color: "#ffffff",
        },
        completed: {
          background: "#23c275",
          color: "#ffffff",
        },
      },
      content: {
        pending: {
          stepNumber: { color: "#a1a3a7" },
          title: { color: "#a1a3a7" },
          status: { background: "#f2f2f2", color: "#a1a3a7" },
          description: { color: "#a1a3a7" },
        },
        progress: {
          stepNumber: { color: "#131b26" },
          title: { color: "#131b26" },
          status: { background: "#e7e9fd", color: "#3c3fed" },
          description: { color: "#131b26" },
        },
        completed: {
          stepNumber: { color: "#131b26" },
          title: { color: "#131b26" },
          status: { background: "#e9faf2", color: "#23c275" },
          description: { color: "#131b26" },
        },
      },
      progressBar: {
        pending: {
          background: "#ededed",
        },
        progress: {
          background: "#e7e9fd",
          fill: "#3c3fed",
        },
        completed: {
          background: "#e9faf2",
          fill: "#23c275",
        },
      },
    },
    dark: {
      step: {
        pending: {
          background: "#1a1a1a",
          color: "#767676",
        },
        progress: {
          background: "#19b6fe",
          color: "#ffffff",
        },
        completed: {
          background: "#23c275",
          color: "#ffffff",
        },
      },
      content: {
        pending: {
          stepNumber: { color: "#767676" },
          title: { color: "#767676" },
          status: { background: "#1a1a1a", color: "#767676" },
          description: { color: "#767676" },
        },
        progress: {
          stepNumber: { color: "#ece4d9" },
          title: { color: "#ece4d9" },
          status: { background: "#08374c", color: "#19b6fe" },
          description: { color: "#ece4d9" },
        },
        completed: {
          stepNumber: { color: "#ece4d9" },
          title: { color: "#ece4d9" },
          status: { background: "#0b3a23", color: "#23c275" },
          description: { color: "#ece4d9" },
        },
      },
      progressBar: {
        pending: {
          background: "#1a1a1a",
        },
        progress: {
          background: "#08374c",
          fill: "#19b6fe",
        },
        completed: {
          background: "#0b3a23",
          fill: "#23c275",
        },
      },
    },
  }
  useEffect(() => {
    if (props.match.path == "/order/me/:id") {
      async function fetchMyAPI() {
        clientRequest.getOrder(props.match.params.id).then((res) => {
          setTransactionEhthereum(res.order.transactionEthereum);
          setOrder(res.order);
          setTableItems(res.orderItems);
          setUser(res.user);
          setDiscount(res.discount);
        });
        clientRequest.getCryptoCompare().then((res) => {
          setCrypto({ ...res });
        });
      }
      fetchMyAPI();
    }
    if (props.match.path == "/admin/order/:id") {
      async function fetchMyAPIRoleAdmin() {
        clientRequest.getOrderRoleAdmin(props.match.params.id).then((res) => {
          setTransactionEhthereum(res.order.transactionEthereum);
          setOrder(res.order);
          setTableItems(res.orderItems);
          setUser(res.user);
          setDiscount(res.discount);
        });
      }
      fetchMyAPIRoleAdmin();
    }
  }, []);
  // const StepperComponent=()=>{
  //   return (
  //     <div >
  //       <Stepper step={step}
  //               theme={themeStepper}
               
  //       >
  //         <Step>
  //           <StepTitle>Shipping</StepTitle>
  //         </Step>
  //         <Step>
  //           <StepTitle>Payment</StepTitle>          
  //         </Step>
  //         <Step >
  //           <StepTitle>Confirm Order</StepTitle>
  //         </Step>
  //       </Stepper>
  //     </div>
  //   )
  // }
  const FormUser = () => {
    return (
      <>
        <h4>Customer</h4>
        {user._id && (
          <div className="row form-user">
            <div className="col-12">
              <div className="avatar">
                <img src={user.avatar.url} />
              </div>
            </div>
            <div className="col-3">Email:</div>
            <div className="col-9">{user.emailUser}</div>
            <div className="col-3">Name:</div>
            <div className="col-9">{user.name}</div>
          </div>
        )}
      </>
    );
  };
  const FormShippingInfo = () => {
    return (
      <>
        {order.shippingInfo && (
          <div className="order-Confirm mt-8">
            <div className="order-Confirm--header d-flex justify-content-between">
              <h3>Order Confirmation</h3>
              <div className="d-flex align-items-center">
                <span>Order Total: </span>{" "}
                <h3> {formatterMoney.format(order.totalPrice)}</h3>{" "}
                <div className="btn-group">
            {order.orderStatus == "Processing" &&
              props.match.path == "/admin/order/:id" && (
                <button
                  className="btn btn-order "
                  onClick={(status) => updateOrderStatus("Confirmed")}
                >
                  Confirm Order
                </button>
              )}
              </div>
              </div>
            </div>
            <div className="order-Confirm--body">
              <div className="order-Confirm--block row">
                <div className="col-6">
                  <h4 className="header-detail">Your information</h4>
                  <span className="row">
                    <label className="label--CustomerName">{user.name}</label>
                    <span>{user.emailUser}</span>
                  </span>
                </div>
                <div className="col-6">
                  <h4 className="header-detail">Shipping Address</h4>
                  <span className="row">
                    <label className="label--CustomerName">{user.name}</label>
                    <span>{order.shippingInfo.address}</span>
                    <span>{order.shippingInfo.city}</span>
                    <span>{order.shippingInfo.country}</span>
                    <span>{order.shippingInfo.postalCode}</span>
                    <span>{order.shippingInfo.phoneNo}</span>
                  </span>
                </div>
              </div>

              <div className="order-Confirm--block row">
                <div className="col-6">
                  <h4 className="header-detail">Payment</h4>
                  <span className="row">
                    <div>
                     {
                      transactionEthereum ? (
                        <>
                         <img
                        className="img-Payment "
                        style={{ height: "50px" } }
                        src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png"
                      ></img>
                      <label style={{fontSize:"20px",marginLeft:"10px"}}>Ethereum</label>
                        </>
                        
                      ) :(
                        <>
                         <img
                        className="img-Payment "
                        style={{ height: "50px" } }
                        src="https://cdn1.iconfinder.com/data/icons/marketplace-and-shipping-filled-outline/64/COD_cash_on_delivery_shipping_payment_delivery-512.png"
                      ></img>
                      <label style={{fontSize:"20px",marginLeft:"10px"}}>COD</label>
                        </>
                      )
                     }
                    </div>
                    {
                      transactionEthereum ? (<>
                       <span style={{ marginLeft: "2%" }}>
                      Hash contract:{<a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/"+transactionEthereum.hash}>{transactionEthereum.hash}</a>}
                      </span>

                      <span style={{ marginLeft: "2%" }}>
                      from:{transactionEthereum.from}
                      </span>
                      <span style={{ marginLeft: "2%" }}>
                      keyword:{transactionEthereum.keyword}
                      </span>
                      <span style={{ marginLeft: "2%" }}>
                      message:{transactionEthereum.message}
                      </span>
                      <span style={{ marginLeft: "2%" }}>
                      value:{transactionEthereum.value} ETH
                      </span></>) :(<></>)

                    
                    }
                  </span>
                </div>
                <div className="col-6">
                  <h4 className="header-detail">Billing Address</h4>
                  <span className="row">
                    <label className="label--CustomerName">{user.name}</label>
                    <span>{order.shippingInfo.address}</span>
                    <span>{order.shippingInfo.city}</span>
                    <span>{order.shippingInfo.country}</span>
                    <span>{order.shippingInfo.postalCode}</span>
                    <span>{order.shippingInfo.phoneNo}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  const FormItems = () => {
    return (
      <>
        {order.orderItems && (
          <>
            <table class="table">
              <thead className="headerTb-Order">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {tableItems &&
                  tableItems.map((item) => (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <img
                        src={item.image}
                        style={{ width: "60px", height: "50px" }}
                      />
                      <td>{item.price}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </>
    );
  };

  const changeUSDToETH = () => {
    // return (order.totalPrice / crypto.USD) * crypto.ETH * 100 / 100;
    return crypto.USD;
  };
  const FormTotal = () => {
    return (
      <>
        <div
          className="Order-Detail--footer"
          style={{ minWidth: "255px", minHeight: "200px", float: "right" }}
        >
          <span className="d-flex justify-content-between">
            <label className="label-pay">Subtotal: </label>
            <label>{formatterMoney.format(order.itemsPrice)}</label>
          </span>
          <span className="d-flex justify-content-between">
            <label className="label-pay">Shipping: </label>
            <label>{formatterMoney.format(order.shippingPrice)}</label>
          </span>
          <span className="d-flex justify-content-between">
            <label className="label-pay">Tax: </label>
            <label>{formatterMoney.format(order.taxPrice)}</label>
          </span>
          <span className="d-flex justify-content-between">
            <label className="" style={{ fontSize: "15px" }}>
              Total:{" "}
            </label>
            <h4>{formatterMoney.format(order.totalPrice)}</h4>
          </span>

          <div className="btn-group">
            {order.orderStatus == "Processing" &&
              props.match.path == "/admin/order/:id" && (
                <button
                  className="btn btn-order "
                  onClick={(status) => updateOrderStatus("Confirmed")
                                       
                }
                >
                  Confirm Order
                </button>
              )}
            {order.orderStatus == "Confirmed" &&
              props.match.path == "/admin/order/:id" && (
                <button
                  className="btn btn-order"
                  onClick={(status) => updateOrderStatus("Delivered")}
                >
                  Delivered
                </button>
              )}
            {order.orderStatus == "Delivered" &&
              props.match.path == "/order/me/:id" && (
                <button
                  className="btn"
                  onClick={(status) => updateOrderStatus("Complete")}
                >
                  Has Received
                </button>
              )}
            {order.orderStatus == "Processing" &&
              props.match.path == "/order/me/:id" && (
                <button
                  className="btn"
                  onClick={(status) => updateOrderStatus("Cancel")}
                >
                  Cancel Order
                </button>
              )}
          </div>
        </div>
      </>
    );
  };

  const updateOrderStatus = (status) => {
    clientRequest
      .updateOrder(order._id, status)
      .then((res) => {
        setOrder({ ...order, orderStatus: res.order.orderStatus });
        // incrementStep();
        NotificationManager.success("Success", "success");
      })
      .catch((err) => NotificationManager.error("Success", "error"));
  };

  return (
    <div className="container py-4 order-detail">
 
      <FormShippingInfo />
      <div className="order-DetailTable">
        <FormItems />
      </div>

      <FormTotal />
    </div>
  );
};
export default OrderDetail;
