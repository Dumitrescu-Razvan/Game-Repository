import {render,fireEvent, getByLabelText} from '@testing-library/react';
import AddGame from '../components/AddGame';
import { MemoryRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

jest.mock('axios');

test('renders AddGame page and checks if the text fields are present', () => {
    const { getByLabelText, getByText } = render(<AddGame />, { wrapper: Router });

    // Check if the AddGame page is rendered
    const addGamePage = getByText(/Add Game/i);
    expect(addGamePage).toBeInTheDocument();


    // Check if the text fields are present
    const titleField = getByLabelText(/Title/i);
    const yearField = getByLabelText(/Year/i);
    const ratingField = getByLabelText(/Rating/i);
    expect(titleField).toBeInTheDocument();
    expect(yearField).toBeInTheDocument();
    expect(ratingField).toBeInTheDocument();
    
});

test('render AddGame page and check if leaving the text fields empty will show an error message', () => {
    // Mock the window.alert function
    window.alert = jest.fn();
    const { getByText, getByTestId } = render(<AddGame />, { wrapper: Router });
    

    // Click the Add Game button
    const addGameButton = getByText(/Save/i);
    fireEvent.click(addGameButton);

    // Check if the alert message is shown
    expect(window.alert).toBeCalledWith("All fields are required");
    
});

test('render AddGame page and check if entering a non-numeric value in the year field will show an error message', () => {
    // Mock the window.alert function
    window.alert = jest.fn();
    const { getByText, getByLabelText } = render(<AddGame />, { wrapper: Router });

    // Enter a non-numeric value in the year field
    const yearField = getByLabelText(/Year/i);
    fireEvent.change(yearField, { target: { value: 'abcd' } });

    //Enter a valid value in the title and rating fields
    const titleField = getByLabelText(/Title/i);
    fireEvent.change(titleField, { target: { value: 'Super Mario Bros.' } });
    const ratingField = getByLabelText(/Rating/i);
    fireEvent.change(ratingField, { target: { value: '9/10' } });

    // Click the Add Game button
    const addGameButton = getByText(/Save/i);
    fireEvent.click(addGameButton);

    // Check if the alert message is shown
    expect(window.alert).toBeCalledWith("Year should be a number");
});
