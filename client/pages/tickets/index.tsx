import Link from 'next/link';
import Router from 'next/router';
import buildClient from '../../api/build-client';

interface Ticket {
  id: string;
  title: string;
  price: number;
}

interface TicketsPageProps {
  tickets: Ticket[];
}

const TicketsIndex = ({ tickets }: TicketsPageProps) => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="page-subtitle">All available tickets for purchase</p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary">
          + Sell a Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fa-solid fa-ticket" /></div>
          <h3 className="empty-state-title">No tickets yet</h3>
          <p className="empty-state-text">
            There are no tickets listed. Be the first to list one!
          </p>
          <Link href="/tickets/new" className="btn btn-primary">
            Sell a Ticket
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="table-row-link"
                  onClick={() => Router.push('/tickets/[ticketId]', `/tickets/${ticket.id}`)}
                >
                  <td style={{ fontWeight: 600 }}>{ticket.title}</td>
                  <td>
                    <span className="ticket-card-price" style={{ fontSize: '1rem' }}>
                      ${ticket.price.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="btn btn-sm btn-secondary">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

TicketsIndex.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
  } catch (err) {
    return { tickets: [] };
  }
};

export default TicketsIndex;
