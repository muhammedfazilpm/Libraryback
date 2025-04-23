import React, { useState, useEffect } from 'react';
import apicall from '../../../utils/Apicall';
import UserHeader from '../../../components/Userheader';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { format ,addDays } from 'date-fns';

const BorrowList = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response=await apicall('get','/users/borrow',{},true,"user")
      console.log(response)
      
      if (!response.success) {
        throw new Error('Failed to fetch borrows');
      }
      
      const data = response.borrows
      setBorrows(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleReturnClick = (borrow) => {
    setSelectedBorrow(borrow);
    setOpenReturnDialog(true);
  };

  const handleConfirmReturn = async () => {
    try {
        const response=await apicall('delete',`/users/borrows/${selectedBorrow._id}/return`,{},true,'user')
    
      
      if (!response.success) {
        throw new Error('Failed to return book');
      }
      
      setSuccessMessage('Book returned successfully');
      setOpenReturnDialog(false);
      fetchBorrows(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenReturnDialog(false);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
    <UserHeader/>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Borrowed Books
      </Typography>
      
      {borrows.length === 0 ? (
        <Typography variant="body1">You haven't borrowed any books yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows?.map((borrow) => (
                <TableRow key={borrow._id}>
                  <TableCell>{borrow.bookId?.name || 'Unknown Book'}</TableCell>
                  <TableCell>{borrow.bookId?.author || 'Unknown Author'}</TableCell>
                  <TableCell>
                    {format(new Date(borrow?.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                  {format(addDays(new Date(borrow?.date), 14), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReturnClick(borrow)}
                    >
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Return Confirmation Dialog */}
      <Dialog open={openReturnDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Return</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return "{selectedBorrow?.bookId?.title || 'this book'}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmReturn} color="primary" autoFocus>
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
};

export default BorrowList;