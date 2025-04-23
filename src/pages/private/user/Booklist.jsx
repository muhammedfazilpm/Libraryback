import React, { useState, useEffect } from 'react';
import UserHeader from '../../../components/Userheader';
import apicall from '../../../utils/Apicall';
import {
  Box,
  Container,
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
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating
} from '@mui/material';
import { 
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

const BookList = () => {
  const [books, setBooks] = useState([]);
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [wishlist, setWishlist] = useState([]);

  // Fetch books with pagination and search
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await apicall(
        'get',
        `/users/books?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`,
        {},
        true,
        'user'
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

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    try {
      const response = await apicall(
        'get',
        '/user/wishlist',
        null,
        true
      );
      setWishlist(response.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
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

  // Toggle book in wishlist
  const toggleWishlist = async (bookId) => {
    try {
      const response = await apicall(
        'post',
        `/user/wishlist/${bookId}`,
        null,
        true
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to update wishlist');
      }

      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success'
      });
      
      // Update local wishlist state
      if (wishlist.includes(bookId)) {
        setWishlist(wishlist.filter(id => id !== bookId));
      } else {
        setWishlist([...wishlist, bookId]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // Borrow book
  const handleBorrow = async (bookId) => {
    setLoading(true);
    try {
      const response = await apicall(
        'post',
        `/users/borrow/${bookId}`,
        null,
        true
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to borrow book');
      }

      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success'
      });
      
      // Refresh book list to update availability
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
      <UserHeader />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Book Catalog
            </Typography>
            <Box>
              <Button 
                variant={viewMode === 'grid' ? 'contained' : 'outlined'} 
                onClick={() => setViewMode('grid')}
                sx={{ mr: 1 }}
              >
                Grid View
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'contained' : 'outlined'} 
                onClick={() => setViewMode('table')}
              >
                Table View
              </Button>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by book name or author..."
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
          ) : viewMode === 'grid' ? (
            <>
              {/* Grid View */}
              <Grid container spacing={3}>
                {books.map((book) => (
                  <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/*  */}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {book.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {book.author}
                        </Typography>
                        {/* <Box sx={{ my: 1 }}>
                          <Rating 
                            value={book.averageRating || 0} 
                            precision={0.5} 
                            readOnly 
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({book.ratingsCount || 0} reviews)
                          </Typography>
                        </Box> */}
                        <Typography variant="body2">
                          Published: {book.publishyear}
                        </Typography>
                        <Typography variant="body2">
                          ISBN: {book.ISBN}
                        </Typography>
                        <Chip 
                          label={book.number > 0 ? 'Available' : 'Out of Stock'} 
                          color={book.number > 0 ? 'success' : 'error'} 
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>

                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                          variant="contained" 
                          size="small"
                          disabled={book.available <= 0}
                          onClick={() => handleBorrow(book._id)}
                        >
                          Borrow
                        </Button>

</Box>
                      {/* <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton 
                          onClick={() => toggleWishlist(book._id)}
                          color={wishlist.includes(book._id) ? 'primary' : 'default'}
                        >
                          {wishlist.includes(book._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <Button 
                          variant="contained" 
                          size="small"
                          disabled={book.available <= 0}
                          onClick={() => handleBorrow(book._id)}
                        >
                          Borrow
                        </Button>
                      </Box> */}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              {/* Table View */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book._id}>
                       
                        <TableCell>{book.name}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.publishyear}</TableCell>
                       
                        <TableCell>
                          <Chip 
                            label={book.number > 0 ? 'Available' : 'Out of Stock'} 
                            color={book.number > 0 ? 'success' : 'error'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          
                          <Button 
                            variant="contained" 
                            size="small"
                            disabled={book.available <= 0}
                            onClick={() => handleBorrow(book._id)}
                            sx={{ ml: 1 }}
                          >
                            Borrow
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

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
        </Box>

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

export default BookList;