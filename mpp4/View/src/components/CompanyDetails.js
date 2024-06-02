import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Container, Button, ButtonGroup } from '@mui/material';
import { getCompany } from '../Service/Service';

function CompanyDetails() {
  const navigate = useNavigate();
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
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" sx={{ fontSize: 20, color: 'darkblue' }}>
        {company.name}
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, color: 'darkred' }}>
        {company.location}
      </Typography>
      <ButtonGroup>
        <Button variant="contained" color="secondary" onClick={()=>{navigate("/companies")}}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={()=>{navigate(`/editcompany/${company.id}`)}}>
          Edit
        </Button>
      </ButtonGroup>  
    </Container>
  );
}

export default CompanyDetails;