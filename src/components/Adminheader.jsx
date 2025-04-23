import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Book as BookIcon,
  People as PeopleIcon,
  ListAlt as ListAltIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

function AdminHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Check if current route matches the button's route
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={() => {
        localStorage.removeItem('adminToken');
        navigate('/adminlogin');
        handleMenuClose();
      }}>
        <LogoutIcon sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      sx={{ mt: '45px' }}
    >
      <MenuItem 
        onClick={() => navigate('/users')}
        selected={isActive('/users')}
        sx={{ bgcolor: isActive('/users') ? 'action.selected' : 'inherit' }}
      >
        <PeopleIcon sx={{ mr: 1 }} /> Users
      </MenuItem>
      <MenuItem 
        onClick={() => navigate('/books')}
        selected={isActive('/books')}
        sx={{ bgcolor: isActive('/books') ? 'action.selected' : 'inherit' }}
      >
        <BookIcon sx={{ mr: 1 }} /> Books
      </MenuItem>
      <MenuItem 
        onClick={() => navigate('/borrow-list')}
        selected={isActive('/borrow-list')}
        sx={{ bgcolor: isActive('/borrow-list') ? 'action.selected' : 'inherit' }}
      >
        <ListAltIcon sx={{ mr: 1 }} /> Borrow List
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <AccountCircleIcon sx={{ mr: 1 }} /> Profile
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'primary.main',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)'
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              textDecoration: 'none',
              flexGrow: isMobile ? 0 : 1
            }}
          >
            LIBRARY ADMIN
          </Typography>

          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              ml: 4,
              '& .MuiButton-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }
            }}>
              <Button 
                color="inherit" 
                startIcon={<PeopleIcon />}
                sx={{ 
                  mx: 1,
                  backgroundColor: isActive('/users') ? 'rgba(255,255,255,0.2)' : 'inherit',
                  fontWeight: isActive('/users') ? 'bold' : 'normal'
                }}
                onClick={() => navigate('/users')}
              >
                Users
              </Button>
              <Button 
                color="inherit" 
                startIcon={<BookIcon />}
                sx={{ 
                  mx: 1,
                  backgroundColor: isActive('/books') ? 'rgba(255,255,255,0.2)' : 'inherit',
                  fontWeight: isActive('/books') ? 'bold' : 'normal'
                }}
                onClick={() => navigate('/books')}
              >
                Books
              </Button>
              <Button 
                color="inherit" 
                startIcon={<ListAltIcon />}
                sx={{ 
                  mx: 1,
                  backgroundColor: isActive('/borrow-list') ? 'rgba(255,255,255,0.2)' : 'inherit',
                  fontWeight: isActive('/borrow-list') ? 'bold' : 'normal'
                }}
                onClick={() => navigate('/borrow-list')}
              >
                Borrow List
              </Button>
            </Box>
          )}

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            ml: 'auto'
          }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ 
                p: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'secondary.main',
                  color: 'white'
                }}
              >
                A
              </Avatar>
              {!isMobile && (
                <Typography variant="body1" sx={{ ml: 1 }}>
                  Admin
                </Typography>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

export default AdminHeader;