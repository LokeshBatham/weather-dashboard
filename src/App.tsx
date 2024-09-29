// App.tsx
import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import Loader from './components/Loader';

const drawerWidth = 240;
const Dashboard = lazy(() => import('./components/Dashboard'));
const User = lazy(() => import('./components/User'));

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [route, setRoute] = useState<string>("/")
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseDrawer = (route: string) => {
    setMobileOpen(false);
    setRoute(route) 
  };

  const drawer = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
        <Typography variant="h5">Menu</Typography>
        {isMobile && (
          <IconButton color="inherit" edge="end" onClick={() => handleCloseDrawer("")}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ padding: '0px 16px 16px' }}>
        <ListItem sx={{ margin: '5px 0px' }} className={route === "/" ? "activeSidebar" : "inactiveSidebar"} component={Link} to="/" onClick={() => handleCloseDrawer("/")}>
          <ListItemText className="fontweight" primary="Dashboard" />
        </ListItem>
        <ListItem sx={{ margin: '5px 0px' }} className={route === "/user" ? "activeSidebar" : "inactiveSidebar"} component={Link} to="/user" onClick={() => handleCloseDrawer("/user")}>
          <ListItemText primary="User" />
        </ListItem>
      </List>
    </>
  );

  return (
    <Router>
      <Box>
        <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              Weather App
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, width: { sm: `calc(100% - 290px)` }, ml: { sm: `${drawerWidth}px` } }}>
          <Toolbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user" element={<User />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Router>
  );
};
export default App;
