import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "customer_id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "phone", label: "Phone", minWidth: 170 },
  { id: "district", label: "District", minWidth: 170 },
  { id: "department", label: "Department", minWidth: 170 },
];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/customers");
        setCustomers(data);
      } catch (error) {
        setError("Error fetching customers.");
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/customers/${selectedCustomer.customer_id}`
      );
      setCustomers(
        customers.filter(
          (customer) => customer.customer_id !== selectedCustomer.customer_id
        )
      );
      handleCloseDeleteModal();
    } catch (error) {
      setError("Error deleting customer.");
      console.error("Error deleting customer:", error);
    }
  };

  const handlePrintPDF = () => {
    const input = document.getElementById("table-to-pdf-customer");
    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("customers_report.pdf");
    });
  };

  const handleAddCustomerClick = () => {
    navigate("/add-customer");
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customers
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" color="primary" onClick={handlePrintPDF}>
          Print PDF Report
        </Button>
        <Paper sx={{ width: "100%", mt: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }} id="table-to-pdf-customer">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {customers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={customer.customer_id}
                      onClick={() => handleOpenDeleteModal(customer)}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id} align="left">
                          {customer[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {selectedCustomer && (
          <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete the customer{" "}
                <strong>{selectedCustomer.name}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCustomer}
                color="primary"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>

      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add Customer"
          onClick={handleAddCustomerClick}
        />
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add Complaint"
          onClick={() => navigate("/add-complaint")}
        />
      </SpeedDial>
    </Container>
  );
};

export default Customers;
