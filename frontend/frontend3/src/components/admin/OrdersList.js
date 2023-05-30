import Pagination from "react-js-pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import clientRequest from "../../APIFeatures/clientRequest";
import { getFormattedDate } from "./../../HandlerCaculate/formatDate";
import { useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";

const OrdersList = (props) => {
  const [stOrders, setStOrders] = useState([]);
  const [sizePage, setSizePage] = useState({
    current: 1,
    total: 0,
    count: 10,
  });

  useEffect(() => {
    props.match.path == "/order/me" &&
      clientRequest.getMyOrders().then((res) => {
        // setStOrders(res.orders)
        setSizePage({ ...sizePage, total: res.orders.length });

      });

    props.match.path == "/admin/orders" &&
      clientRequest.getOrders().then((res) => {

        setSizePage({ ...sizePage, total: res.orders.length });
      });
  }, []);
  useEffect(() => {
    props.match.path == "/order/me" &&
      clientRequest.getMyOrdersSearch(sizePage.current).then((res) => {
        setStOrders(res.ordersPage);
      });
    props.match.path == "/admin/orders" &&
      clientRequest.getOrdersSearch(sizePage.current).then((res) => {
        setStOrders(res.ordersPage);
      });
  }, [sizePage.current]);
  const OrderRow = (order) => {
    return (
      <tr>
        <td>
          <p className="text-xs font-weight-bold mb-0">{order._id}</p>
        </td>
        <td>
          <p className="text-xs font-weight-bold mb-0">{order.totalPrice}</p>
        </td>
        <td className="align-middle text-center text-sm">
          <p className="text-xs font-weight-bold mb-0">{order.orderStatus}</p>
        </td>
        <td className="align-middle text-center">
          <span className="text-secondary text-xs font-weight-bold">
            {getFormattedDate(order.createAt)}
          </span>
        </td>
        <td className="align-middle">
          {props.match.path == "/admin/orders" && (
            <Link
              to={"/admin/order/" + order._id}
              className="text-secondary font-weight-bold text-xs"
              data-toggle="tooltip"
              data-original-title="Edit user"
            >
              Detail
            </Link>
          )}
          {props.match.path == "/order/me" && (
            <Link
              to={"/order/me/" + order._id}
              className="text-secondary font-weight-bold text-xs"
              data-toggle="tooltip"
              data-original-title="Edit user"
            >
              Detail
            </Link>
          )}
        </td>
      </tr>
    );
  };
  const handlePageChange = (pageNumber) => {
    setSizePage((sizePage) => ({ ...sizePage, current: pageNumber }));
  };
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header pb-0">
              <h6>Order List</h6>
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
              ></div>
              <br />
            </div>
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Order Id
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Total Price
                      </th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Status
                      </th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        CreatedAt
                      </th>
                      <th className="text-secondary opacity-7" />
                    </tr>
                  </thead>
                  <tbody>
                    {stOrders &&
                      stOrders.map((item) => {
                        return OrderRow(item);
                      })}
                  </tbody>
                </table>
                <div>
                  <Pagination
                    activePage={sizePage.current}
                    itemsCountPerPage={sizePage.count}
                    totalItemsCount={sizePage.total}
                    itemClass="page-item"
                    linkClass="page-link"
                    onChange={(e) => handlePageChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrdersList;
