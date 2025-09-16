import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  return (
    <AppBar position="static" color="primary" sx={{ bgcolor: '#3f51b5' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
        <Typography
          variant="h5"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Travel Advisor
        </Typography>

        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}
          >
            Explore new places
          </Typography>

          <Box
            sx={(theme) => ({
              position: 'relative',
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
            })}
          >
            <Box
              sx={(theme) => ({
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <SearchIcon />
            </Box>

            <InputBase
              placeholder="Search..."
              sx={(theme) => ({
                color: 'inherit',
                '& input::placeholder': {
                  color: 'white',
                  opacity: 0.7,
                },
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                  [theme.breakpoints.up('md')]: { width: '20ch' },
                },
              })}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
