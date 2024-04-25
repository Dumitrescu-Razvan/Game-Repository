import { render, fireEvent } from '@testing-library/react';
import VideoGameTable from '../components/VideoGameTable';
import { deleteGame, data } from '../Service/Service';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

jest.mock('../Service/Service', () => ({
  deleteGame: jest.fn(),
  data: [
    { id: 1, title: 'The Legend of Zelda', year: 1986, rating: '10/10' },
    { id: 2, title: 'Super Mario Bros.', year: 1985, rating: '9/10' },
  ],
}));

test('renders VideoGameTable and checks delete button click', () => {
  const { getByText } = render(<Router><VideoGameTable /></Router>);
  
  // Check if the table renders with the correct data
  const gameTitle1 = getByText(/The Legend of Zelda/i);
  const gameTitle2 = getByText(/Super Mario Bros./i);
  expect(gameTitle1).toBeInTheDocument();
  expect(gameTitle2).toBeInTheDocument();
});

test('renders VideoGameTable and checks if the view, edit, and delete buttons are present', () => {
    const { getByText } = render(<Router><VideoGameTable /></Router>);

    //Click on the first row of the table
    const row1 = getByText(/The Legend of Zelda/i);
    fireEvent.click(row1);
    
    // Check if the view, edit, and delete buttons are present
    const viewButton = getByText(/View Details/i);
    const editButton = getByText(/Edit/i);
    const deleteButton = getByText(/Delete/i);
    expect(viewButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    }
);

test('renders VideoGameTable and checks delete button click', () => {
    window.confirm = jest.fn(() => true);

    const { getByText } = render(<Router><VideoGameTable /></Router>);
    
    //Click on the first row of the table
    const row1 = getByText(/The Legend of Zelda/i);
    fireEvent.click(row1);
    
    // Click on the delete button
    const deleteButton = getByText(/Delete/i);
    fireEvent.click(deleteButton);

    // Check if the delete button is called
    expect(deleteGame).toHaveBeenCalled();

    // Check if the delete button is called with the correct id
    expect(deleteGame).toHaveBeenCalledWith(1);
});



test('renders VideoGameTable and checks if the view button click navigates to the correct page', () => {
    const { getByText } = render(<Router><VideoGameTable /></Router>);
    
    //Click on the first row of the table
    const row1 = getByText(/The Legend of Zelda/i);
    fireEvent.click(row1);
    
    // Click on the view button
    const viewButton = getByText(/View Details/i);
    fireEvent.click(viewButton);
    
    // Check if the view button navigates to the correct page
    expect(window.location.pathname).toBe('/game/1');
});

test('renders VideoGameTable and checks if the edit button click navigates to the correct page', () => {
    const { getByText } = render(<Router><VideoGameTable /></Router>);
    
    //Click on the first row of the table
    const row1 = getByText(/The Legend of Zelda/i);
    fireEvent.click(row1);
    
    // Click on the edit button
    const editButton = getByText(/Edit/i);
    fireEvent.click(editButton);
    
    // Check if the edit button navigates to the correct page
    expect(window.location.pathname).toBe('/edit/1');
});