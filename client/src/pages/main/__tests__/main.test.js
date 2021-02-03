/* eslint-disable no-unused-vars */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Main from '../index';

describe('<Main />', () => {
  it('renders <Main />', () => {
    render(<Main />);
    expect(true).toBe(true);
  });
});
