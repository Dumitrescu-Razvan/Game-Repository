import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { useStyles } from '../styles/GameDetailsStyle';
import { getCompany } from '../Service/Service';

function CompanyDetails() {
    const classes = useStyles();
    const { id } = useParams();
    const [company, setCompany] = React.useState(null);
  
    React.useEffect(() => {
      getCompany(id).then((company) => {
        setCompany(company);
      });
    } , [id]);
  
    if (!company) {
      return <Box>Loading...</Box>;
    }
  
    return (
      <Box className={classes.gameDetails}>
        <Typography className={classes.gameDetailsTitle} style={{ fontWeight: 'bold'  , fontSize: '60px' }}>{company.name}</Typography>
        <Typography variant="body1">Company ID: {company.id}</Typography>
        <Typography variant="body1">Company Location: {company.location}</Typography>
      </Box>
    );
  }
  
  export default CompanyDetails;