import { React, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import clientRequest from "../../APIFeatures/clientRequest";
import { getFormattedDate } from "./../../HandlerCaculate/formatDate";

const DiscountList = () => {
  const [sizePage, setSizePage] = useState({
    current: 1,
    total: 0,
    count: 10,
  });
  const [discounts, setDiscounts] = useState();
  const [searchName, setSearchName] = useState("");
  const [user, setUser] = useState({});
  useEffect(async () => {
    const list = await clientRequest.getListDiscount(searchName);

    setDiscounts(list.discounts);
  }, [searchName]);
  useEffect(async () => {
    const res = await clientRequest.getProfileMe();
    setUser(res.user);
  }, []);
  const handlePageChange = (pageNumber) => {
    setSizePage((sizePage) => ({ ...sizePage, current: pageNumber }));
  };

  const DiscountRow = (discount) => {
    return (
      <tr>
        <td>
          <div className="d-flex px-2 py-1">
            <div>
              <p>{discount.name}</p>
            </div>
          </div>
        </td>
        <td>
          <p className="text-xs font-weight-bold mb-0">
            {getFormattedDate(discount.validDate)}
          </p>
        </td>
        <td className="align-middle text-center text-sm">
          <p className="text-xs font-weight-bold mb-0">{discount.quantity}</p>
        </td>
        <td className="align-middle text-center text-sm">
          <p className="text-xs font-weight-bold mb-0" style={{ color: "red" }}>
            {discount.used ? "Used" : ""}
          </p>
        </td>
        <td className="align-middle text-center">
          <span className="text-secondary text-xs font-weight-bold">
            {getFormattedDate(discount.createAt)}
          </span>
        </td>
        <td className="align-middle">
          <Link
            to={"/discount/" + discount._id}
            className="text-secondary font-weight-bold text-xs"
            data-toggle="tooltip"
            data-original-title="Edit user"
          >
            Info
          </Link>
        </td>
      </tr>
    );
  };
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header pb-0">
              <h6>Discount List</h6>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                  className="search-product"
                  placeholder="Search product"
                  onChange={(e) => setSearchName(e.currentTarget.value)}
                />
                {user.role == "admin" && (
                  <Link
                    name=""
                    id=""
                    class="btn create-button"
                    to="/admin/create-discount"
                    role="button"
                  >
                    Create Discount
                  </Link>
                )}
              </div>
              <br />
            </div>
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Name
                      </th>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                        Valid
                      </th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        Quantity{" "}
                      </th>
                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        {" "}
                      </th>

                      <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                        CreatedAt
                      </th>
                      <th className="text-secondary opacity-7" />
                    </tr>
                  </thead>
                  <tbody>
                    {discounts && discounts.map((item) => DiscountRow(item))}
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
export default DiscountList;
