import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import App from '../App';

describe('App component', () => {
  it('renders a BrowserRouter component', () => {
    const app = TestRenderer.create(<App />);
    const instance = app.root;
    expect(() => instance.findByType(BrowserRouter)).not.toThrowError();
  });

  it('matches snapshot', () => {
    const app = TestRenderer.create(<App />);
    const tree = app.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
