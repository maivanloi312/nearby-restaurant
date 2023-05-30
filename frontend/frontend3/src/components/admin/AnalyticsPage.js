import React from "react";
import { Line } from "react-chartjs-2";
import { useEffect } from "react";
import clientRequest from "../../APIFeatures/clientRequest";
import { useState } from "react";
import CardItem from "./CardItem";
import Swal from "sweetalert2";
var XLSX = require("xlsx");
const data = {
  labels: ["Ngày 6", "Ngày 5", "Ngày 4", "Ngày 3", "Ngày 2", "Ngày 1"],
  datasets: [
    {
      label: "product created",
      data: [12, 309, 3, 5, 2, 3],
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const AnalyticsPage = () => {
  const [analyticProduct, setAnalyticProduct] = useState();
  const [openDateRP, setOpenDateRP] = useState(false);
  const [dataRP, SetDataRP] = useState({
    dateStart: "",
    dateEnd: "",
    type: "",
  });
  const [dataToRP, SetDataToRP] = useState();
  const [analyticUser, setAnalyticUser] = useState();
  const [analyticOrder, setAnalyticOrder] = useState();
  const [topSellingProduct, setTopSellingProduct] = useState();
  const [topReviewProduct, setTopReviewProduct] = useState();
  const [topUser, setTopUser] = useState();
  const [totalPayment, setTotalPayment] = useState();
  const [filter, setFilter] = useState("week");
  const [stProduct, setStProduct] = useState(0);
  const [stUser, setStUser] = useState(0);
  const [stOrder, setStOrder] = useState(0);
  const [payment, setPayment] = useState(0);

  const handleExportRP = () => {
    openDateRP == true ? setOpenDateRP(false) : setOpenDateRP(true);
  };


  useEffect(() => {
    async function ExportReport() {
      if (openDateRP) {
        const { value: formValues } = await Swal.fire({
          title: "Export Report",
          confirmButtonText: "CONTINUE",
          html:
            '<label class="label_date">from:</label>' +
            '<input id="swal-input1" type="date" class="swal2-input">' +
            "<br>" +
            '<label class="label_date">To:</label>' +
            '<input id="swal-input2" type="date" class="swal2-input">',
          focusConfirm: false,
          showCloseButton: true,
          willClose: () => {
            SetDataRP({
              dateStart: "",
              dateEnd: "",
              type: "",
            });
            setOpenDateRP(false);
          },
          preConfirm: () => {
            if (!document.getElementById("swal-input1").value) {
              Swal.showValidationMessage("Date from is required");
            }

            if (!document.getElementById("swal-input2").value) {
              Swal.showValidationMessage("Date To is required");
            }
            return [
              document.getElementById("swal-input1").value,
              document.getElementById("swal-input2").value,
            ];
          },
        });

        async function GetType() {
          const { value: typex } = await Swal.fire({
            confirmButtonText: "EXPORT",
            title: "TYPE",
            input: "select",
            inputOptions: {
              product: "product",
              order: "order",
              customer: "customer",
              total: "total",
            },
            inputPlaceholder: "Select Type",
            showCancelButton: true,
            willClose: () => {
              SetDataRP({
                dateStart: "",
                dateEnd: "",
                type: "",
              });
            },
          });

          if (typex) {
            console.log("type", typex);
            SetDataRP({
              dateStart: formValues[0],
              dateEnd: formValues[1],
              type: typex,
            });
          }
        }

        if (formValues) {
          GetType();
        }
      }
    }

    ExportReport();
  }, [openDateRP]);

  const handleOnExport = (dataToRP) => {
    
      let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(dataToRP);
      XLSX.utils.book_append_sheet(wb, ws, "MySheet2");
      XLSX.writeFile(wb, "MyExcel1.xlsx");
    
  };


  useEffect(() => {
    if (dataRP.dateEnd != "") {
      const getDataRP = async () => {
        const res = await clientRequest.analyticsByDate(dataRP);
        if (res) {
          SetDataToRP(res.models);
        }
      };
      getDataRP();
    }
  }, [dataRP]);


  useEffect(()=>{
    async function PrintRP()
    {
      let data=await dataToRP;
      if(dataToRP)
      {
        handleOnExport(dataToRP)
      }
    }
    PrintRP();
  }
  ,[dataToRP])

  useEffect(async () => {
    Promise.all([
      await clientRequest.analyticsByProduct(filter),
      await clientRequest.analyticsByUser(filter),
      await clientRequest.analyticsByOrder(filter),
      await clientRequest.topSellingByProduct(filter),
      await clientRequest.topSellingByReview(filter),
      await clientRequest.topSellingByUser(filter),
      await clientRequest.analyticsByTotalPayment(filter),
    ]).then((res) => {
      setAnalyticProduct(res[0].data);
      setAnalyticUser(res[1].data);
      setAnalyticOrder(res[2].data);
      setTopSellingProduct(res[3].finalList);
      setTopReviewProduct(res[4].finalList);
      setTopUser(res[5].finalList);
      setTotalPayment(res[6].data);
      const totalProduct = res[0].data.datasets[0].data.reduce(
        (a, v) => a + v,
        0
      );
      const totalUser = res[1].data.datasets[0].data.reduce((b, c) => b + c, 0);
      const totalOrder = res[2].data.datasets[0].data.reduce(
        (b, c) => b + c,
        0
      );
      const tPayment = res[6].data.datasets[0].data.reduce((b, c) => b + c, 0);

      setStProduct(totalProduct);
      setStUser(totalUser);
      setStOrder(totalOrder);
      setPayment(Math.round((tPayment + Number.EPSILON) * 100) / 100);
    });
  }, [filter]);
  return (
    <>
      <div className="header">
        <select
          style={{ paddingRight: "30px" }}
          className="form-select"
          aria-label="Default select example"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value={"week"} selected>
            Filter By Week
          </option>
          <option value={"month"}>Filter By Month</option>
          <option value={"year"}>Filter By Year</option>
        </select>
        <button
          onClick={() => {
            handleExportRP();
          }}
          className=" btn btn-primary"
          style={{
            color: "#fff",
            textTransform: "uppercase",
            padding: "none",
            marginTop: "15px",
            marginLeft: "10px",
          }}
        >
          Export Report
        </button>
        <br />
        <br />
        <div className="row">
          <CardItem title="Products" total={stProduct} icon="fas fa-archive" />
          <CardItem title="Users" total={stUser} icon="fas fa-user" />
          <CardItem
            title="Orders"
            total={stOrder}
            icon="fas fa-shipping-fast"
          />
          <CardItem
            title="Total payment"
            total={payment}
            icon="fas fa-dollar-sign"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            {analyticProduct && (
              <Line data={analyticProduct} options={options} />
            )}
          </div>
          <div className="col-md-6">
            {analyticUser && <Line data={analyticUser} options={options} />}
          </div>
          <div className="col-md-6">
            {analyticOrder && <Line data={analyticOrder} options={options} />}
          </div>
          <div className="col-md-6">
            {totalPayment && <Line data={totalPayment} options={options} />}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-4">
            <h6>Best - selling product</h6>
            <table className="table">
              <thead>
                <th scope="col">No</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
              </thead>
              <tbody>
                {topSellingProduct &&
                  topSellingProduct.map(
                    (item, index) =>
                      item && (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <h6>Top products with the most views </h6>
            <table className="table">
              <thead>
                <th scope="col">No</th>
                <th scope="col">Name</th>
                <th scope="col">Num of Review</th>
              </thead>
              <tbody>
                {topReviewProduct &&
                  topReviewProduct.map(
                    (item, index) =>
                      item && (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{item.name}</td>
                          <td>{item.numOfReviews}</td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="row">
            <div className="col-md-4">
              <h6>Top users buy the most</h6>
              <table className="table">
                <thead>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Num of Orders</th>
                </thead>
                <tbody>
                  {topUser &&
                    topUser.map((item, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.numOfOrders}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AnalyticsPage;
