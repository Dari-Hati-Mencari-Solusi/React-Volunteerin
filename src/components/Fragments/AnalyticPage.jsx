import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../../hooks/UseTheme";

const Analytics = () => {
    const { theme } = useTheme();
    
    const analyticsData = [
        { month: "Jan", users: 1200, revenue: 5000 },
        { month: "Feb", users: 1900, revenue: 7500 },
        { month: "Mar", users: 1600, revenue: 6000 },
        { month: "Apr", users: 2800, revenue: 11000 },
        { month: "May", users: 2500, revenue: 9500 },
        { month: "Jun", users: 3800, revenue: 16000 },
        { month: "Jul", users: 3500, revenue: 14000 },
        { month: "Aug", users: 4000, revenue: 18000 },
        { month: "Sep", users: 4200, revenue: 20000 },
        { month: "Oct", users: 4500, revenue: 21500 },
        { month: "Nov", users: 3800, revenue: 18000 },
        { month: "Dec", users: 5000, revenue: 23000 }
    ];

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Analytics Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">User Growth</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={analyticsData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="month" 
                                    strokeWidth={0} 
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis 
                                    strokeWidth={0} 
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <Tooltip />
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#2563eb" 
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Revenue Analysis</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={analyticsData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="month" 
                                    strokeWidth={0} 
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis 
                                    strokeWidth={0} 
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#16a34a" 
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Performance Metrics</p>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                            <h3 className="text-lg font-medium">Conversion Rate</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">3.2%</p>
                            <p className="mt-1 text-sm text-slate-500">+0.5% from last month</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                            <h3 className="text-lg font-medium">Avg. Session Duration</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">4:32</p>
                            <p className="mt-1 text-sm text-slate-500">+0:45 from last month</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                            <h3 className="text-lg font-medium">Bounce Rate</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">42%</p>
                            <p className="mt-1 text-sm text-slate-500">-3% from last month</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
                            <h3 className="text-lg font-medium">Returning Users</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">68%</p>
                            <p className="mt-1 text-sm text-slate-500">+5% from last month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;