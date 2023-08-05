import { OrderType, StripeOrder } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then((response) => setOrders(response.data));
  }, []);

  return (
    <>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Products</th>
            <th>PAID</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order: OrderType) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.name} | {order.email} <br />
                  {order.streetAddress}, {order.city}, {order.country} <br />
                  {order.postalCode}
                </td>
                <td>
                  {order.line_items.map((item: StripeOrder) => (
                    <>
                      {item.price_data.product_data.name} x
                      <b>{item.quantity}</b>
                      <br />
                    </>
                  ))}
                </td>
                <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                  {order.paid ? 'YES' : 'NO'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
