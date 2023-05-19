import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, frFR } from "@mui/x-data-grid";
import { getRowEl } from "@mui/x-data-grid/utils/domUtils";

const columns = [
  { field: "id", headerName: "N° de commande", flex: 3 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "total", headerName: "Total", type: "number", flex: 1 },
];

const getTotal = (order) =>
  order.items
    .map((item) => item.amount_subtotal)
    .reduce((sum, current) => sum + current, 0) / 100;

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
  useEffect(() => {
    fetch("/api/orders").then((res) =>
      res.json().then((data) => {
        console.log(data);
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
    // const orders = data.json();
    // console.log(orders);
  }, []);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={rows}
          onRowClick={(params) => console.log(params.row)}
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
  );
}
