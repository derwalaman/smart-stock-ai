import { useEffect, useState } from "react";

import api from "../../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

import {
    Package,
    AlertTriangle,
} from "lucide-react";

import { motion } from "framer-motion";

const COLORS = [
    "#8b5cf6",
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
];

const InventoryChart = () => {

    const [chartData, setChartData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalStock: 0,
        lowStock: 0,
        categories: 0,
    });

    useEffect(() => {

        fetchInventoryData();

    }, []);

    const fetchInventoryData = async () => {

        try {

            const res = await api.get("/products");

            const products = res.data;

            // CATEGORY GROUPING

            const grouped = {};

            products.forEach((product) => {

                const category =
                    product.category || "Other";

                if (!grouped[category]) {

                    grouped[category] = 0;
                }

                grouped[category] += product.stock;
            });

            const formattedData =
                Object.entries(grouped).map(
                    ([name, stock]) => ({
                        name,
                        stock,
                    })
                );

            // SORT DESCENDING

            formattedData.sort(
                (a, b) =>
                    b.stock - a.stock
            );

            setChartData(formattedData);

            // STATS

            const totalStock =
                products.reduce(
                    (acc, product) =>
                        acc + product.stock,
                    0
                );

            const lowStock =
                products.filter(
                    (product) =>
                        product.stock < 20
                ).length;

            setStats({
                totalStock,
                lowStock,
                categories:
                    formattedData.length,
            });

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    return (

        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="
                bg-white/5
                border border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
                overflow-hidden
            "
        >

            {/* HEADER */}

            <div className="flex items-start justify-between mb-8">

                <div>

                    <h2 className="text-2xl font-bold">
                        Inventory Overview
                    </h2>

                    <p className="text-zinc-400 mt-1">
                        Real-time inventory analytics
                    </p>

                </div>

                <div
                    className="
                        w-14 h-14
                        rounded-2xl
                        bg-gradient-to-br
                        from-violet-600
                        to-indigo-600
                        flex items-center justify-center
                        shadow-lg
                        shadow-violet-500/20
                    "
                >
                    <Package size={24} />
                </div>

            </div>

            {/* STATS */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-4
                    mb-8
                "
            >

                <div
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-2xl
                        p-4
                    "
                >

                    <p className="text-zinc-400 text-sm">
                        Total Stock
                    </p>

                    <h3 className="text-3xl font-black mt-2">
                        {stats.totalStock}
                    </h3>

                </div>

                <div
                    className="
                        bg-white/5
                        border border-white/10
                        rounded-2xl
                        p-4
                    "
                >

                    <p className="text-zinc-400 text-sm">
                        Categories
                    </p>

                    <h3 className="text-3xl font-black mt-2">
                        {stats.categories}
                    </h3>

                </div>

                <div
                    className="
                        bg-red-500/10
                        border border-red-500/20
                        rounded-2xl
                        p-4
                    "
                >

                    <div className="flex items-center gap-2">

                        <AlertTriangle
                            size={18}
                            className="text-red-400"
                        />

                        <p className="text-red-300 text-sm">
                            Low Stock
                        </p>

                    </div>

                    <h3 className="text-3xl font-black mt-2 text-red-400">
                        {stats.lowStock}
                    </h3>

                </div>

            </div>

            {/* CHART */}

            <div className="h-[350px]">

                {!loading && (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#27272a"
                            />

                            <XAxis
                                dataKey="name"
                                stroke="#a1a1aa"
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                stroke="#a1a1aa"
                                tickLine={false}
                                axisLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill:
                                        "rgba(255,255,255,0.05)",
                                }}
                                contentStyle={{
                                    background:
                                        "#18181b",
                                    border:
                                        "1px solid rgba(255,255,255,0.1)",
                                    borderRadius:
                                        "16px",
                                    color:
                                        "#fff",
                                }}
                            />

                            <Bar
                                dataKey="stock"
                                radius={[
                                    12,
                                    12,
                                    0,
                                    0,
                                ]}
                            >

                                {chartData.map(
                                    (
                                        entry,
                                        index
                                    ) => (

                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                COLORS[
                                                index %
                                                COLORS.length
                                                ]
                                            }
                                        />

                                    )
                                )}

                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </motion.div>
    );
};

export default InventoryChart;