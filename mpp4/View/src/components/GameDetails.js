import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { getGame } from '../Service/Service';
import { Button, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function GameDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game, setGame] = React.useState(null);

  React.useEffect(() => {
    getGame(id).then((game) => {
      setGame(game);
    });
  }, [id]);

  if (!game) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" sx={{ fontSize: 20, color: 'darkblue' }}>
        {game.name}
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, color: 'darkred' }}>
        {game.release_year}
      </Typography>
      <Typography variant="h6" sx={{ fontSize: 16, color: 'darkred' }}>
        {game.rating}
      </Typography>
      <ButtonGroup>
        <Button variant="contained" color="secondary" onClick={()=>{navigate("/games")}}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={()=>{navigate(`/edit/${game.id}`)}}>
          Edit
        </Button>
      </ButtonGroup>  
    </Box>
  );
}

export default GameDetails;