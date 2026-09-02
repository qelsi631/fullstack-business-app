function StatCard({title, value, change}){
    return(
        <div className="stat-card">
            <p>{title}</p>

            <h2>{value}</h2>

            <span>{change}</span>
        </div>
    )
}

export default StatCard;

