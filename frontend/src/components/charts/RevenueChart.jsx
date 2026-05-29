import {
    AreaChart,
    Area,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";

import api from "../../services/api";

const RevenueChart = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchRevenue();
    }, []);

    const fetchRevenue = async () => {

        try {

            const res = await api.get(
                "/dashboard/monthly-revenue"
            );

            setData(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div
            className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-6
        h-[420px]
        backdrop-blur-xl
      "
        >

            <div className="mb-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Revenue Analytics
                        </h2>

                        <p className="text-zinc-400 mt-1">
                            Monthly revenue generated
                        </p>

                    </div>

                    <div
                        className="
              px-4 py-2
              rounded-xl
              bg-green-500/10
              text-green-400
              text-sm
              font-semibold
            "
                    >
                        Live Data
                    </div>

                </div>

            </div>

            <ResponsiveContainer width="100%" height="80%">

                <AreaChart data={data}>

                    <defs>

                        <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.8}
                            />

                            <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                            />

                        </linearGradient>

                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#27272a"
                    />

                    <XAxis
                        dataKey="month"
                        stroke="#71717a"
                    />

                    <Tooltip
                        contentStyle={{
                            background: "#18181b",
                            border: "1px solid #27272a",
                            borderRadius: "16px",
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={4}
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>
    );
};

export default RevenueChart;