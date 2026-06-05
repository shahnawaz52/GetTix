import Router from 'next/router';
import buildClient from '../../api/build-client';
import useRequest from '../../hooks/use-request';

interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

interface TicketShowProps {
  ticket: Ticket;
  currentUser: { id: string; email: string } | null;
}

const TicketShow = ({ ticket, currentUser }: TicketShowProps) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order: any) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  const isOwner = currentUser?.id === ticket.userId;
  const isReserved = !!ticket.orderId;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="card card-highlight">
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 className="page-title">{ticket.title}</h1>
        </div>

        <div className="detail-row">
          <span className="detail-label">Price</span>
          <span className="ticket-card-price" style={{ fontSize: '1.25rem' }}>
            ${ticket.price.toFixed(2)}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className={`badge ${isReserved ? 'badge-pending' : 'badge-complete'}`}>
            {isReserved ? 'Reserved' : 'Available'}
          </span>
        </div>

        {errors}

        <div style={{ marginTop: 'var(--space-xl)' }}>
          {!currentUser ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
              Sign in to purchase this ticket
            </p>
          ) : isOwner ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
              You own this ticket
            </p>
          ) : isReserved ? (
            <button className="btn btn-secondary btn-full btn-lg" disabled>
              Currently Reserved
            </button>
          ) : (
            <button
              id="purchase-ticket"
              className="btn btn-primary btn-full btn-lg"
              onClick={() => doRequest()}
            >
              Purchase Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);

  return { ticket: data };
};

export default TicketShow;
