import {
   AccountCircleOutlined,
   AdminPanelSettings,
   CategoryOutlined,
   ConfirmationNumberOutlined,
   DashboardOutlined,
   EscalatorWarningOutlined,
   FemaleOutlined,
   LoginOutlined,
   MaleOutlined,
   SearchOutlined,
   VpnKeyOutlined,
} from '@mui/icons-material';
import {
   Box,
   Divider,
   Drawer,
   IconButton,
   Input,
   InputAdornment,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   ListSubheader,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AuthContext, UiContext } from '../../context';

export const SideMenu = () => {
   const router = useRouter();

   const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
   const { isUserLoggedIn, user, logout } = useContext(AuthContext);

   const [searchQuery, setSearchQuery] = useState('');

   const onSearchQuery = () => {
      if (searchQuery.trim().length === 0) return;
      navigateTo(`/search/${searchQuery}`);
   };

   const navigateTo = (url: string) => {
      toggleSideMenu();
      router.push(url);
   };

   return (
      <Drawer
         open={isMenuOpen}
         anchor="right"
         sx={{ backdropFilter: 'blur(3px)', transition: 'all 0.5s ease-out' }}
         onClose={toggleSideMenu}
      >
         <Box sx={{ width: 250, paddingTop: 5 }}>
            <List>
               <ListItem>
                  <Input
                     autoFocus
                     value={searchQuery}
                     type="text"
                     placeholder="Search..."
                     endAdornment={
                        <InputAdornment position="end">
                           <IconButton onClick={onSearchQuery}>
                              <SearchOutlined />
                           </IconButton>
                        </InputAdornment>
                     }
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && onSearchQuery()}
                  />
               </ListItem>

               {isUserLoggedIn && (
                  <>
                     <ListItem button>
                        <ListItemIcon>
                           <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Profile'} />
                     </ListItem>

                     <ListItem button onClick={() => navigateTo('/orders/history')}>
                        <ListItemIcon>
                           <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'My Orders'} />
                     </ListItem>
                  </>
               )}

               <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/men')}>
                  <ListItemIcon>
                     <MaleOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Men'} />
               </ListItem>

               <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/women')}>
                  <ListItemIcon>
                     <FemaleOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Women'} />
               </ListItem>

               <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo('/category/kids')}>
                  <ListItemIcon>
                     <EscalatorWarningOutlined />
                  </ListItemIcon>
                  <ListItemText primary={'Kids'} />
               </ListItem>

               {isUserLoggedIn ? (
                  <ListItem button onClick={logout}>
                     <ListItemIcon>
                        <LoginOutlined />
                     </ListItemIcon>
                     <ListItemText primary={'Log out'} />
                  </ListItem>
               ) : (
                  <ListItem button onClick={() => navigateTo(`/auth/login?p=${router.route}`)}>
                     <ListItemIcon>
                        <VpnKeyOutlined />
                     </ListItemIcon>
                     <ListItemText primary={'Sign In'} />
                  </ListItem>
               )}

               {user?.role === 'admin' && (
                  <>
                     <Divider />
                     <ListSubheader>Admin Panel</ListSubheader>
                     <ListItem button>
                        <ListItemIcon>
                           <CategoryOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Products'} />
                     </ListItem>

                     <ListItem button onClick={() => navigateTo('/admin')}>
                        <ListItemIcon>
                           <DashboardOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                     </ListItem>

                     <ListItem button onClick={() => navigateTo('/admin/orders')}>
                        <ListItemIcon>
                           <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Orders'} />
                     </ListItem>

                     <ListItem button onClick={() => navigateTo('/admin/users')}>
                        <ListItemIcon>
                           <AdminPanelSettings />
                        </ListItemIcon>
                        <ListItemText primary={'Users'} />
                     </ListItem>
                  </>
               )}
            </List>
         </Box>
      </Drawer>
   );
};
