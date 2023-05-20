import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getTotal } from "@/lib/utils";
import style from "../styles/OrderDetails.module.css";

const { orderDetailsContainer, title } = style;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#324d67",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TAX_RATE = 0.2;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

// const invoiceSubtotal = subtotal(rows);
// const invoiceTaxes = TAX_RATE * invoiceSubtotal;
// const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function OrderDetails({ orderDetails }) {
  console.log({ orderDetails });
  return (
    <div className={orderDetailsContainer}>
      <h2 className={title}>Détails de la commande {orderDetails._id}</h2>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <StyledTableRow>
              {/* <StyledTableCell align="center" colSpan={6}>
              <strong>Détails de la commande</strong>
            </StyledTableCell> */}
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <strong>Produit</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                <strong>Qté</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                <strong>Prix unitaire</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                <strong>Montant</strong>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {orderDetails?.items?.map((row) => (
              <StyledTableRow key={row.description}>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell align="right">{row.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.amount_total / row.quantity / 100}€
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.amount_total / 100}€
                </StyledTableCell>
              </StyledTableRow>
            ))}

            <StyledTableRow>
              <StyledTableCell rowSpan={3} />
              <StyledTableCell colSpan={2}>
                <strong>Sous-total</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                {getTotal(orderDetails)}€
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <strong>TVA</strong>
              </StyledTableCell>
              <StyledTableCell align="right">{`${(TAX_RATE * 100).toFixed(
                0
              )} %`}</StyledTableCell>
              <StyledTableCell align="right">{0}€</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={2}>
                <strong>Total</strong>
              </StyledTableCell>
              <StyledTableCell align="right">
                {getTotal(orderDetails)}€
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
