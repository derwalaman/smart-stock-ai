import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Laptops", stock: 120 },
    { name: "Phones", stock: 95 },
    { name: "Audio", stock: 60 },
    { name: "Gaming", stock: 80 },
];

const InventoryChart = () => {
    return (
        <div
            className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-6
        h-[420px]
      "
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold">
                    Inventory Overview
                </h2>

                <p className="text-zinc-400 mt-1">
                    Product stock distribution
                </p>
            </div>

            <ResponsiveContainer width="100%" height="80%">

                <BarChart data={data}>

                    <XAxis
                        dataKey="name"
                        stroke="#71717a"
                    />

                    <Tooltip />

                    <Bar
                        dataKey="stock"
                        fill="#8b5cf6"
                        radius={[10, 10, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>
        </div>
    );
};

export default InventoryChart;