import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { getCompany } from '../Service/Service';

function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = React.useState(null);

  React.useEffect(() => {
    getCompany(id).then((company) => {
      setCompany(company);
    });
  }, [id]);

  if (!company) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography sx={{ fontSize: 20, color: 'darkblue' }} >{company.name}</Typography>
      <Typography variant="body1">Company ID: {company.id}</Typography>
      <Typography variant="body1">Company Location: {company.location}</Typography>
    </Box>
  );
}

export default CompanyDetails;