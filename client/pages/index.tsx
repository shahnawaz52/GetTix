import Link from 'next/link';
import Router from 'next/router';
import buildClient from '../api/build-client';

interface Ticket {
  id: string;
  title: string;
  price: number;
}

interface LandingPageProps {
  currentUser: { id: string; email: string } | null;
  tickets: Ticket[];
}

const LandingPage = ({ currentUser, tickets }: LandingPageProps) => {
  if (!currentUser) {
    return (
      <div className="hero">
        <h1 className="hero-title">
          The modern way to
          <br />
          <span className="hero-gradient-text">buy &amp; sell tickets</span>
        </h1>
        <p className="hero-subtitle">
          A secure, real-time marketplace for event tickets. List your tickets,
          find great deals, and purchase with confidence.
        </p>
        <div className="hero-actions">
          <Link href="/auth/signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link href="/auth/signin" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Tickets</h1>
          <p className="page-subtitle">Browse and purchase tickets for events</p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary">
          + Sell a Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fa-solid fa-ticket" /></div>
          <h3 className="empty-state-title">No tickets available</h3>
          <p className="empty-state-text">
            Be the first to list a ticket for sale.
          </p>
          <Link href="/tickets/new" className="btn btn-primary">
            Sell a Ticket
          </Link>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => Router.push('/tickets/[ticketId]', `/tickets/${ticket.id}`)}
            >
              <h3 className="ticket-card-title">{ticket.title}</h3>
              <p className="ticket-card-price">${ticket.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

LandingPage.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
  } catch (err) {
    return { tickets: [] };
  }
};

export default LandingPage;
