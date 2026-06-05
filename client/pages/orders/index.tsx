import Link from 'next/link';
import buildClient from '../../api/build-client';

interface Order {
  id: string;
  status: string;
  ticket: {
    title: string;
    price: number;
  };
}

interface OrdersPageProps {
  orders: Order[];
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

const OrdersIndex = ({ orders }: OrdersPageProps) => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track your ticket purchases</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="fa-solid fa-receipt" /></div>
          <h3 className="empty-state-title">No orders yet</h3>
          <p className="empty-state-text">
            When you purchase a ticket, your orders will appear here.
          </p>
          <Link href="/" className="btn btn-primary">
            Browse Tickets
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.ticket.title}</td>
                  <td>${order.ticket.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href="/orders/[orderId]"
                      as={`/orders/${order.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      View
                    </Link>
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

OrdersIndex.getInitialProps = async (context: any) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/orders');
    return { orders: data };
  } catch (err) {
    return { orders: [] };
  }
};

export default OrdersIndex;
