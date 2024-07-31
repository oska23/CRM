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
  Badge,
  Alert,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "subject", label: "Subject", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "customer_name", label: "Customer Name", minWidth: 170 },
  { id: "district", label: "District", minWidth: 170 },
  { id: "department", label: "Department", minWidth: 170 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "created_at", label: "Date Created", minWidth: 170 },
];

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get(
          "https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/complaints"
        );
        // Sort complaints by newest first (descending order)
        const sortedComplaints = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setComplaints(sortedComplaints);
      } catch (error) {
        setError("Error fetching complaints.");
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedComplaint(null);
  };

  const handlePrintPDF = () => {
    const input = document.getElementById("table-to-pdf-complaint");
    html2canvas(input, {
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }).then((canvas) => {
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

      pdf.save("complaints_report.pdf");
    });
  };

  const handleUpdateStatus = async (complaintId) => {
    try {
      await axios.put(`http://localhost:3001/api/complaints/${complaintId}`, {
        status: "Resolved",
      });
      console.log(
        `Updated status for complaint with ID: ${complaintId} to Resolved`
      );
      // Update complaints state or handle success message
      const updatedComplaints = complaints.map((complaint) =>
        complaint.complaint_id === complaintId
          ? { ...complaint, status: "Resolved" }
          : complaint
      );
      setComplaints(updatedComplaints);
    } catch (error) {
      setError("Error updating status.");
      console.error("Error updating status:", error);
      // Handle error state or show error message
    }
  };

  const handleAddComplaintClick = () => {
    navigate("/add-complaint");
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complaints
        </Typography>
        <Button variant="contained" color="primary" onClick={handlePrintPDF}>
          Print PDF Report
        </Button>
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <Paper sx={{ width: "100%", mt: 2 }}>
          <TableContainer
            sx={{ maxHeight: "calc(100vh - 300px)" }}
            id="table-to-pdf-complaint"
          >
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
                {complaints
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((complaint) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={complaint.complaint_id}
                      onClick={() => handleRowClick(complaint)}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id} align="left">
                          {column.id === "status" ? (
                            <Badge
                              color={
                                complaint.status === "Resolved"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {complaint.status}
                            </Badge>
                          ) : column.id === "created_at" ? (
                            dayjs(complaint.created_at).format("DD/MM/YYYY")
                          ) : (
                            complaint[column.id]
                          )}
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
            count={complaints.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {selectedComplaint && (
          <Dialog open={openDetailsModal} onClose={handleCloseDetailsModal}>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogContent>
              <Typography>
                <strong>Subject:</strong> {selectedComplaint.subject}
              </Typography>
              <Typography>
                <strong>Description:</strong>{" "}
                {selectedComplaint.description || "N/A"}
              </Typography>
              <Typography>
                <strong>Customer Name:</strong>{" "}
                {selectedComplaint.customer_name}
              </Typography>
              <Typography>
                <strong>District:</strong> {selectedComplaint.district}
              </Typography>
              <Typography>
                <strong>Department:</strong> {selectedComplaint.department}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedComplaint.status}
              </Typography>
              <Typography>
                <strong>Created At:</strong>{" "}
                {dayjs(selectedComplaint.created_at).format("DD/MM/YYYY")}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsModal} color="primary">
                Close
              </Button>
              {selectedComplaint.status !== "Resolved" && (
                <Button
                  onClick={() =>
                    handleUpdateStatus(selectedComplaint.complaint_id)
                  }
                  color="secondary"
                >
                  Mark as Resolved
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}
      </Box>

      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={handleAddComplaintClick}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add Complaint"
          onClick={handleAddComplaintClick}
        />
      </SpeedDial>
    </Container>
  );
};

export default Complaints;
