import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { DataGrid, frFR } from "@mui/x-data-grid";
import OrderDetails from "./OrderDetails";
import style from "../styles/DataTable.module.css";

import { getTotal } from "@/lib/utils";

const { ordersContainer, orderTable } = style;

const columns = [
  { field: "id", headerName: "N° de commande", flex: 3 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "total", headerName: "Total", type: "number", flex: 1 },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  frFR
);

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  // const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/api/orders").then((res) =>
      res.json().then((data) => {
        console.log(data);
        setOrders(data.ordersArray);
        console.log(data.ordersArray);
        const populatedRows = data.ordersArray.map((order) => {
          return {
            id: order._id,
            date: new Date(order.timestamp).toLocaleDateString(),
            total: `${getTotal(order)}€`,
          };
        });
        setRows(populatedRows);
      })
    );
  }, []);

  const handleRowClick = (orderId) => {
    setIsDetailVisible(!isDetailVisible);
    const selectedRow = orders.filter((o) => o._id === orderId);
    console.log({ selectedRow });
    setSelectedOrder(selectedRow[0]);
  };

  return (
    <div className={ordersContainer}>
      {isDetailVisible && <OrderDetails orderDetails={selectedOrder} />}

      <div className={orderTable} style={{ height: 400, width: "100%" }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows}
            onRowClick={(params) => handleRowClick(params.row.id)}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
