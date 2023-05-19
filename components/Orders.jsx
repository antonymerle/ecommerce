import DataTable from "./DataTable";
import style from "../styles/Orders.module.css";

const { container, title } = style;

const Orders = () => {
  return (
    <div className={container}>
      <h1 className={title}>Mes commandes</h1>
      <DataTable />
    </div>
  );
};

export default Orders;
