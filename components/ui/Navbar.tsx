import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { AppBar, Badge, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext } from '../../context';

export const Navbar = () => {
   const { asPath, push } = useRouter();
   const { toggleSideMenu } = useContext(UiContext);

   const [searchQuery, setSearchQuery] = useState('');
   const [isSearchVisible, setIsSearchVisible] = useState(false);

   const onSearchQuery = () => {
      if (searchQuery.trim().length === 0) return;
      push(`/search/${searchQuery}`);
   };

   return (
      <AppBar>
         <Toolbar>
            <NextLink href="/" passHref>
               <Link display="flex" alignItems="center">
                  <Typography variant="h6">Teslo |</Typography>
                  <Typography sx={{ ml: 0.5 }}>Shop</Typography>
               </Link>
            </NextLink>
            <Box flex={1} />
            <Box className="fadeIn" sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
               <NextLink href="/category/men" passHref>
                  <Link>
                     <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Men</Button>
                  </Link>
               </NextLink>

               <NextLink href="/category/women" passHref>
                  <Link>
                     <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Women</Button>
                  </Link>
               </NextLink>
               <NextLink href="/category/kids" passHref>
                  <Link>
                     <Button color={asPath === '/category/kids' ? 'primary' : 'info'}>Kids</Button>
                  </Link>
               </NextLink>
            </Box>
            <Box flex={1} />
            {isSearchVisible ? (
               <Input
                  className="fadeIn"
                  autoFocus
                  value={searchQuery}
                  type="text"
                  placeholder="Search..."
                  endAdornment={
                     <InputAdornment position="end">
                        <IconButton onClick={() => setIsSearchVisible(false)}>
                           <ClearOutlined />
                        </IconButton>
                     </InputAdornment>
                  }
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearchQuery()}
               />
            ) : (
               <IconButton sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => setIsSearchVisible(true)}>
                  <SearchOutlined />
               </IconButton>
            )}

            <IconButton sx={{ display: { xs: 'block', sm: 'none' } }} onClick={toggleSideMenu}>
               <SearchOutlined />
            </IconButton>
            <NextLink href="/cart" passHref>
               <Link>
                  <IconButton>
                     <Badge badgeContent={2} color="secondary">
                        <ShoppingCartOutlined />
                     </Badge>
                  </IconButton>
               </Link>
            </NextLink>
            <Button onClick={toggleSideMenu}>Menu</Button>
         </Toolbar>
      </AppBar>
   );
};
