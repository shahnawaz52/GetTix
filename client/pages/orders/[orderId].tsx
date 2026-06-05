import { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import buildClient from '../../api/build-client';
import useRequest from '../../hooks/use-request';

interface OrderShowProps {
  order: {
    id: string;
    status: string;
    expiresAt: string;
    ticket: {
      title: string;
      price: number;
    };
  };
  currentUser: { id: string; email: string } | null;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    created: 'badge-created',
    cancelled: 'badge-cancelled',
    'awaiting:payment': 'badge-pending',
    complete: 'badge-complete',
  };
  return map[status] || 'badge-created';
};

const OrderShow = ({ order, currentUser }: OrderShowProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const cardRef = useRef<any>(null);
  const stripeRef = useRef<any>(null);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => {
      setPaymentSuccess(true);
      setPaying(false);
    },
  });

  // Countdown timer
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [order]);

  // Initialize Stripe Elements
  useEffect(() => {
    if (order.status !== 'created' || typeof window === 'undefined') return;

    const initStripe = () => {
      const win = window as any;
      if (!win.Stripe) {
        setTimeout(initStripe, 200);
        return;
      }

      const stripe = win.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY);
      stripeRef.current = stripe;

      const elements = stripe.elements();
      const card = elements.create('card', {
        style: {
          base: {
            color: '#f9fafb',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#6b7280' },
          },
          invalid: { color: '#fca5a5' },
        },
      });

      const el = document.getElementById('card-element');
      if (el) {
        card.mount('#card-element');
        cardRef.current = card;
      }
    };

    initStripe();

    return () => {
      if (cardRef.current) {
        cardRef.current.destroy();
      }
    };
  }, [order.status]);

  const handlePay = async () => {
    if (!stripeRef.current || !cardRef.current) return;

    setPaying(true);
    setStripeError(null);

    const { error, token } = await stripeRef.current.createToken(cardRef.current);

    if (error) {
      setStripeError(error.message);
      setPaying(false);
      return;
    }

    await doRequest({ token: token.id });
    setPaying(false);
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft <= 0;
  const isCancelled = order.status === 'cancelled';
  const isComplete = order.status === 'complete' || paymentSuccess;
  const showTimer = !isCancelled && !isComplete;
  const canPay = showTimer && !isExpired;

  return (
    <>
      <Head>
        <script src="https://js.stripe.com/v3/" async />
      </Head>
      <div className="order-detail">
        <div className="card card-highlight">
          {isComplete && (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)', color: 'var(--status-success)' }}><i className="fa-solid fa-circle-check" /></div>
              <h2 style={{ color: 'var(--status-success)', marginBottom: 'var(--space-sm)' }}>
                Payment Successful!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Your ticket has been purchased
              </p>
            </div>
          )}

          {showTimer && (
            <div className="order-timer">
              <div className={`order-timer-value ${isExpired ? 'order-timer-expired' : ''}`}>
                {isExpired ? 'Expired' : formatTime(timeLeft)}
              </div>
              <div className="order-timer-label">
                {isExpired ? 'This order has expired' : 'Time remaining to complete payment'}
              </div>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Ticket</span>
            <span className="detail-value">{order.ticket.title}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span className="ticket-card-price" style={{ fontSize: '1.25rem' }}>
              ${order.ticket.price.toFixed(2)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`badge ${isComplete ? 'badge-complete' : statusBadge(order.status)}`}>
              {isComplete ? 'complete' : order.status}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Order ID</span>
            <span className="detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              {order.id}
            </span>
          </div>

          {canPay && (
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <label className="form-label">Card Details</label>
              <div
                id="card-element"
                style={{
                  padding: '14px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--space-lg)',
                }}
              />

              {stripeError && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-md)' }}>
                  <ul><li>{stripeError}</li></ul>
                </div>
              )}
              {errors}

              <button
                id="pay-button"
                className="btn btn-primary btn-full btn-lg"
                onClick={handlePay}
                disabled={paying}
              >
                {paying ? 'Processing...' : `Pay $${order.ticket.price.toFixed(2)}`}
              </button>

              <p style={{
                textAlign: 'center',
                marginTop: 'var(--space-md)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Test card: 4242 4242 4242 4242 · Any future date · Any CVC
              </p>
            </div>
          )}

          {isCancelled && (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0', color: 'var(--text-muted)' }}>
              This order has been cancelled
            </div>
          )}
        </div>
      </div>
    </>
  );
};

OrderShow.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get(`/api/orders/${context.query.orderId}`);
    return { order: data };
  } catch (err) {
    if (typeof window === 'undefined' && context.res) {
      context.res.writeHead(302, { Location: '/orders' });
      context.res.end();
    }
    return { order: { id: '', status: 'cancelled', expiresAt: new Date().toISOString(), ticket: { title: '', price: 0 } } };
  }
};

export default OrderShow;
