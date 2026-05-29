import {
    Package,
    ShoppingCart,
    DollarSign,
    Users,
    TrendingUp,
    ArrowUpRight,
    Activity,
} from "lucide-react";

import RevenueChart from "../components/charts/RevenueChart";
import InventoryChart from "../components/charts/InventoryChart";

import ThemeToggle from "../components/theme/ThemeToggle";

import { motion } from "framer-motion";

import { toast } from "sonner";

import { useEffect, useState } from "react";

import { getSettings } from "../utils/settings";

import api from "../services/api";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Dashboard = () => {

    const [stats, setStats] = useState(null);

    const [activities, setActivities] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [customers, setCustomers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const settings = getSettings();

    const fetchDashboardData = async () => {

        try {

            const [
                statsRes,
                activityRes,
                ordersRes,
                productsRes,
                customersRes,
            ] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/dashboard/recent-activity"),
                api.get("/orders"),
                api.get("/products"),
                api.get("/customers"),
            ]);

            setStats(statsRes.data);

            setActivities(activityRes.data);

            setOrders(ordersRes.data);

            setProducts(productsRes.data);

            setCustomers(customersRes.data);

        } catch (error) {

            console.log(error);

            toast.error(
                "Failed to fetch dashboard data"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    // SETTINGS

    const taxPercentage =
        Number(
            settings.orderSettings.taxPercentage
        );

    const shippingCharge =
        Number(
            settings.orderSettings.shippingCharge
        );

    // REAL REVENUE CALCULATION

    const totalRevenue =
        orders
            .filter(
                (order) =>
                    order.status !== "Cancelled"
            )
            .reduce(
                (acc, order) => {

                    const subtotal =
                        order.total_price;

                    const tax =
                        subtotal *
                        (
                            taxPercentage / 100
                        );

                    return (
                        acc +
                        subtotal +
                        tax +
                        shippingCharge
                    );

                },
                0
            );

    // ANALYTICS

    const completedOrders =
        orders.filter(
            (order) =>
                order.status === "Completed"
        ).length;

    const pendingOrders =
        orders.filter(
            (order) =>
                order.status === "Pending"
        ).length;

    const lowStockProducts =
        products.filter(
            (product) =>
                product.stock <
                settings.inventorySettings
                    .lowStockThreshold
        ).length;

    const formatCurrency = (value) => {

        if (value >= 1000000000) {

            return `$${(
                value / 1000000000
            ).toFixed(1)}B`;
        }

        if (value >= 1000000) {

            return `$${(
                value / 1000000
            ).toFixed(1)}M`;
        }

        if (value >= 1000) {

            return `$${(
                value / 1000
            ).toFixed(1)}K`;
        }

        return `$${value.toFixed(2)}`;
    };
    // DASHBOARD CARDS

    const cards = [
        {
            title: "Total Revenue",

            value:
                formatCurrency(totalRevenue),

            growth: "+18%",

            icon: DollarSign,
        },

        {
            title: "Orders",

            value: orders.length,

            growth: "+12%",

            icon: ShoppingCart,
        },

        {
            title: "Products",

            value: products.length,

            growth: "+8%",

            icon: Package,
        },

        {
            title: "Customers",

            value: customers.length,

            growth: "+22%",

            icon: Users,
        },
    ];

    // GENERATE REPORT

    const handleGenerateReport = async () => {

        try {

            const report = {

                generatedAt:
                    new Date().toLocaleString(),

                analytics: {

                    totalRevenue,

                    totalOrders:
                        orders.length,

                    totalProducts:
                        products.length,

                    totalCustomers:
                        customers.length,

                    completedOrders,

                    pendingOrders,

                    lowStockProducts,
                },

                recentOrders:
                    orders.slice(0, 10),

                topProducts:
                    products.slice(0, 10),
            };

            const blob = new Blob(
                [
                    JSON.stringify(
                        report,
                        null,
                        2
                    ),
                ],
                {
                    type:
                        "application/json",
                }
            );

            const url =
                URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;

            a.download =
                `smartstock-report-${Date.now()}.json`;

            a.click();

            URL.revokeObjectURL(url);

            toast.success(
                "Analytics report generated successfully"
            );

        } catch (error) {

            toast.error(
                "Failed to generate report"
            );
        }
    };

    return (

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-10 min-h-screen"
        >

            {/* HEADER */}

            <div
                className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
          mb-10
        "
            >

                <div>

                    <div className="flex items-center gap-3">

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
                            <TrendingUp size={28} />
                        </div>

                        <div>

                            <h1
                                className="
                  text-4xl md:text-5xl
                  font-black
                  tracking-tight
                "
                            >
                                Dashboard
                            </h1>

                            <p className="text-zinc-400 mt-1 text-sm md:text-lg">
                                Smart inventory intelligence overview
                            </p>

                        </div>

                    </div>

                </div>

                <div className="flex items-center gap-4">

                    {/* <ThemeToggle /> */}

                    <button
                        onClick={handleGenerateReport}
                        className="
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              px-6 py-3
              rounded-2xl
              font-semibold
              hover:scale-105
              hover:shadow-lg
              hover:shadow-violet-500/20
              transition-all
            "
                    >
                        Generate Report
                    </button>

                </div>

            </div>

            {/* QUICK STATS */}

            <div
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
            >

                {loading ? (

                    [...Array(4)].map((_, index) => (

                        <div
                            key={index}
                            className="
                bg-white/5
                rounded-3xl
                p-6
              "
                        >
                            <Skeleton
                                height={140}
                                baseColor="#18181b"
                                highlightColor="#27272a"
                            />
                        </div>

                    ))

                ) : (

                    cards.map((card, index) => {

                        const Icon = card.icon;

                        return (

                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                className="
                  relative
                  overflow-hidden
                  bg-white/5
                  border border-white/10
                  backdrop-blur-xl
                  rounded-3xl
                  p-6
                  hover:border-violet-500/50
                  hover:translate-y-[-5px]
                  transition-all duration-300
                "
                            >

                                <div
                                    className="
                    absolute
                    top-0 right-0
                    w-32 h-32
                    bg-violet-600/10
                    blur-3xl
                  "
                                />

                                <div className="relative z-10">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-zinc-400">
                                                {card.title}
                                            </p>

                                            <h2 className="text-4xl font-black mt-4">
                                                {card.value}
                                            </h2>

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
                                            <Icon size={24} />
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 mt-6">

                                        <span
                                            className="
                        flex items-center gap-1
                        text-green-400
                        text-sm
                        font-semibold
                      "
                                        >
                                            <ArrowUpRight size={16} />
                                            {card.growth}
                                        </span>

                                        <span className="text-zinc-500 text-sm">
                                            vs last month
                                        </span>

                                    </div>

                                </div>

                            </motion.div>

                        );
                    })

                )}

            </div>

            {/* CHARTS */}

            <div
                className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
        "
            >

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <RevenueChart />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <InventoryChart />
                </motion.div>

            </div>

            {/* BOTTOM SECTION */}

            <div
                className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          mt-8
        "
            >

                {/* RECENT ACTIVITY */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="
            xl:col-span-2
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
            backdrop-blur-xl
          "
                >

                    <div className="flex items-center justify-between mb-8">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Recent Activity
                            </h2>

                            <p className="text-zinc-400 mt-1">
                                Live business operations
                            </p>

                        </div>

                    </div>

                    <div className="space-y-5">

                        {activities.map((activity, index) => (

                            <div
                                key={index}
                                className="
                  flex items-center justify-between
                  bg-white/5
                  border border-white/5
                  rounded-2xl
                  p-5
                  hover:bg-white/10
                  transition-all
                "
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                      w-12 h-12
                      rounded-2xl
                      bg-gradient-to-br
                      from-violet-600
                      to-indigo-600
                      flex items-center justify-center
                    "
                                    >
                                        <Activity size={20} />
                                    </div>

                                    <div>

                                        <h3 className="font-semibold">
                                            Order #{activity.id}
                                        </h3>

                                        <p className="text-zinc-400 text-sm">
                                            Status: {activity.status}
                                        </p>

                                    </div>

                                </div>

                                <span className="text-zinc-500 text-sm">
                                    ${activity.total_price}
                                </span>

                            </div>

                        ))}

                    </div>

                </motion.div>

                {/* PERFORMANCE */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
            backdrop-blur-xl
          "
                >

                    <h2 className="text-2xl font-bold">
                        Performance
                    </h2>

                    <p className="text-zinc-400 mt-1">
                        Real-time operational metrics
                    </p>

                    <div className="space-y-6 mt-8">

                        {[
                            {
                                label: "Revenue Growth",
                                value: "84%",
                            },
                            {
                                label: "Order Success",
                                value: `${stats?.success_rate || 0}%`,
                            },
                            {
                                label: "Inventory Accuracy",
                                value: `${stats?.inventory_accuracy || 0}%`,
                            },
                        ].map((item, index) => (

                            <div key={index}>

                                <div className="flex items-center justify-between mb-2">

                                    <span className="text-zinc-300">
                                        {item.label}
                                    </span>

                                    <span className="font-bold">
                                        {item.value}
                                    </span>

                                </div>

                                <div
                                    className="
                    h-3
                    bg-white/5
                    rounded-full
                    overflow-hidden
                  "
                                >

                                    <div
                                        className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                    "
                                        style={{
                                            width: item.value,
                                        }}
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                </motion.div>

            </div>

        </motion.div>
    );
};

export default Dashboard;