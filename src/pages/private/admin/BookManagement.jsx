import React, { useState, useEffect } from 'react';
import AdminHeader from '../../../components/Adminheader';
import apicall from '../../../utils/Apicall';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Pagination,
  Stack,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    ISBN: '',
    publishyear: '',
    number: 1,
    isBlock: false
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch books with pagination and search
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await apicall(
        'get',
        `/admin/books?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        null,
        true,
        'admin'
      );
      
      setBooks(response.books);
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch books',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [pagination.page, searchTerm]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, page: value });
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
        fetchBooks();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch change
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Open dialog for adding/editing book
  const handleOpenDialog = (book = null) => {
    setCurrentBook(book);
    if (book) {
      setFormData({
        name: book.name,
        author: book.author,
        ISBN: book.ISBN,
        publishyear: book.publishyear,
        number: book.number,
        isBlock: book.isBlock
      });
    } else {
      setFormData({
        name: '',
        author: '',
        ISBN: '',
        publishyear: '',
        number: 1,
        isBlock: false
      });
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBook(null);
  };

  // Submit book (add/edit)
  const handleSubmit = async () => {
    if (!formData.name || !formData.author || !formData.ISBN || !formData.publishyear) {
      setSnackbar({
        open: true,
        message: 'All fields except status are required',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const url = currentBook ? `/admin/books/${currentBook._id}` : '/admin/books';
      const method = currentBook ? 'put' : 'post';

      const response = await apicall(method, url, formData, true, 'admin');

      if (!response.success) {
        throw new Error(response.message || 'Something went wrong');
      }

      setSnackbar({
        open: true,
        message: currentBook ? 'Book updated successfully' : 'Book added successfully',
        severity: 'success'
      });
      fetchBooks();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    setLoading(true);
    try {
      const response = await apicall(
        'delete',
        `/admin/books/${bookId}`,
        null,
        true,
        'admin'
      );

      if (!response.success) {
        throw new Error('Failed to delete book');
      }

      setSnackbar({
        open: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
      fetchBooks();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle book block status
  const toggleBlockStatus = async (bookId, currentStatus) => {
    setLoading(true);
    try {
      const response = await apicall(
        'put',
        `/admin/books/${bookId}`,
        { isBlock: !currentStatus },
        true,
        'admin'
      );

      if (!response.success) {
        throw new Error('Failed to update book status');
      }

      setSnackbar({
        open: true,
        message: `Book ${!currentStatus ? 'blocked' : 'unblocked'} successfully`,
        severity: 'success'
      });
      fetchBooks();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <AdminHeader/>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Book Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Book
            </Button>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by book name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Box>

          {loading && !books.length ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>ISBN</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book._id}>
                        <TableCell>{book.name}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.ISBN}</TableCell>
                        <TableCell>{book.publishyear}</TableCell>
                        <TableCell>{book.number}</TableCell>
                        <TableCell>
                          <Chip 
                            label={book.isBlock ? 'Blocked' : 'Active'} 
                            color={book.isBlock ? 'error' : 'success'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog(book)}>
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(book._id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={book.isBlock}
                                onChange={() => toggleBlockStatus(book._id, book.isBlock)}
                                name="isBlock"
                                color="primary"
                              />
                            }
                            label=""
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Stack spacing={2}>
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Add/Edit Book Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {currentBook ? 'Edit Book' : 'Add New Book'}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Book Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="ISBN"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Publish Year"
                name="publishyear"
                value={formData.publishyear}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Quantity"
                name="number"
                type="number"
                value={formData.number}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isBlock}
                    onChange={handleSwitchChange}
                    name="isBlock"
                    color="primary"
                  />
                }
                label="Block Book"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default BookManagement;