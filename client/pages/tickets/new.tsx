import { useState, FormEvent } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price: parseFloat(price) || 0 },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await doRequest();
  };

  const onBlurPrice = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sell a Ticket</h1>
          <p className="page-subtitle">List your ticket for others to purchase</p>
        </div>
      </div>

      <div className="card card-highlight">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              id="new-ticket-title"
              className="form-input"
              placeholder="e.g. Concert, Sports Game, Festival"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price (USD)</label>
            <input
              id="new-ticket-price"
              className="form-input"
              placeholder="0.00"
              value={price}
              onBlur={onBlurPrice}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {errors}
          <button id="new-ticket-submit" className="btn btn-primary btn-full btn-lg">
            List Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
