const orders = [
  {
    id: 1,
    customer: "John Doe",
    product: "Laptop",
    status: "Completed",
  },
  {
    id: 2,
    customer: "Alex Smith",
    product: "Phone",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Mike Brown",
    product: "Monitor",
    status: "Completed",
  },
];


function RecentOrders(){
    return (
        <div className="recent-orders">
            <h2>Recent Orders</h2>

            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                   {orders.map((order)=>(
                    <tr key={order.id}>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>{order.status}</td>
                        </tr>
                   ))}
                </tbody>
            </table>
        </div>
    )
}


export default RecentOrders;