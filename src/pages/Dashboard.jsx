import StatCard from "../components/StateCard";
import RecentOrders from "../components/RecentOrders";

function Dashboard(){
    return(
        <div>
            <h1>Dashboard</h1>
            <p>Wecome to your business dashboard.</p>

            <div className="stats">
                <StatCard
                  title="Products"
                  value="124"
                  change= "+12% this month"
                />

                <StatCard 
                 title= "Costumers"
                 value = "53"
                 change= "+8% this month"
                />

                <StatCard
                 title="Orders"
                  value="87"
                change="+15% this month"
        />
            </div>

            <RecentOrders/>
        </div>

        
    )
}

export default Dashboard;