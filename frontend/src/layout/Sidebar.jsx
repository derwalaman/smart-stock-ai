import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    ChevronRight,
    Sparkles,
    Menu,
    X,
    Warehouse,
} from "lucide-react";

import { getSettings } from "../utils/settings";

import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const menuItems = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/",
    },
    {
        icon: Package,
        label: "Products",
        path: "/products",
    },
    {
        icon: ShoppingCart,
        label: "Orders",
        path: "/orders",
    },
    {
        icon: Users,
        label: "Customers",
        path: "/customers",
    },
    {
        icon: Settings,
        label: "Settings",
        path: "/settings",
    },
];

const Sidebar = () => {

    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const settings = getSettings();

    const [stats, setStats] = useState(null);

    const [warehouses, setWarehouses] = useState([]);

    const fetchSidebarData = async () => {

        try {

            const statsRes = await api.get(
                "/dashboard/stats"
            );

            setStats(statsRes.data);

            const inventoryRes = await api.get(
                "/dashboard/inventory-overview"
            );

            setWarehouses(inventoryRes.data);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {
        fetchSidebarData();
    }, []);

    const totalStored =
        stats?.total_products || 0;

    const storageCapacity =
        settings.inventorySettings
            .warehouseCapacity;

    const name = settings.profile?.name || "SmartStock Admin";

    const storagePercent = Math.min(
        Math.round(
            (totalStored / storageCapacity) * 100
        ),
        100
    );

    return (
        <>

            {/* MOBILE BUTTON */}

            <button
                onClick={() =>
                    setIsOpen(!isOpen)
                }
                className="
          md:hidden
          fixed
          top-5 left-5
          z-50
          w-12 h-12
          rounded-2xl
          bg-white/10
          border border-white/10
          backdrop-blur-xl
          flex items-center justify-center
        "
            >
                {isOpen ? (
                    <X size={22} />
                ) : (
                    <Menu size={22} />
                )}
            </button>

            {/* OVERLAY */}

            {isOpen && (

                <div
                    onClick={() =>
                        setIsOpen(false)
                    }
                    className="
            md:hidden
            fixed inset-0
            bg-black/50
            backdrop-blur-sm
            z-40
          "
                />

            )}

            {/* SIDEBAR */}

            <aside
                className={`
          fixed md:relative
          z-50 md:z-0
          top-0 left-0

          h-screen

          w-[300px]

          border-r border-white/10
          bg-[#09090b]/95
          backdrop-blur-2xl

          p-6

          flex flex-col

          transition-all duration-300

          ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }
        `}
            >

                {/* LOGO */}

                <div className="mb-14">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                flex items-center justify-center
                shadow-lg shadow-violet-500/30
              "
                        >
                            <Sparkles size={22} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-black tracking-tight">
                                SmartStock
                            </h1>

                            <p className="text-zinc-400 text-sm">
                                AI Inventory Suite
                            </p>

                        </div>

                    </div>

                </div>

                {/* MENU */}

                <div className="space-y-2">

                    {menuItems.map((item, index) => {

                        const Icon = item.icon;

                        const isActive =
                            location.pathname === item.path;

                        return (

                            <Link
                                to={item.path}
                                key={index}
                                onClick={() =>
                                    setIsOpen(false)
                                }
                                className={`
                  relative
                  flex items-center justify-between
                  px-4 py-3.5
                  rounded-2xl
                  transition-all duration-300
                  group overflow-hidden

                  ${isActive
                                        ? `
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-600
                        shadow-lg
                        shadow-violet-500/20
                      `
                                        : `
                        hover:bg-white/10
                      `
                                    }
                `}
                            >

                                {/* ACTIVE GLOW */}

                                {isActive && (

                                    <div
                                        className="
                      absolute
                      inset-0
                      bg-white/10
                    "
                                    />

                                )}

                                <div className="flex items-center gap-4 relative z-10">

                                    <div
                                        className={`
                      transition

                      ${isActive
                                                ? "text-white"
                                                : "text-zinc-400 group-hover:text-white"
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <span
                                        className={`
                      font-medium transition

                      ${isActive
                                                ? "text-white"
                                                : "text-zinc-300 group-hover:text-white"
                                            }
                    `}
                                    >
                                        {item.label}
                                    </span>

                                </div>

                                <ChevronRight
                                    size={18}
                                    className={`
                    relative z-10
                    transition

                    ${isActive
                                            ? "text-white opacity-100"
                                            : "text-zinc-500 opacity-0 group-hover:opacity-100"
                                        }
                  `}
                                />

                            </Link>

                        );
                    })}

                </div>

                {/* STORAGE CARD */}

                <div className="mt-10">

                    <div
                        className="
              rounded-3xl
              border border-white/10
              bg-gradient-to-br
              from-violet-600/20
              to-indigo-600/20
              p-5
              backdrop-blur-xl
            "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-zinc-300">
                                    Inventory Storage
                                </p>

                                <h3 className="text-2xl font-black mt-1">
                                    {storagePercent}%
                                </h3>

                            </div>

                            <div
                                className="
                  w-14 h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-600
                  to-indigo-600
                  flex items-center justify-center
                "
                            >
                                <Package size={22} />
                            </div>

                        </div>

                        {/* PROGRESS */}

                        <div
                            className="
                w-full h-2
                bg-white/10
                rounded-full
                mt-5
                overflow-hidden
              "
                        >

                            <div
                                className="
                  h-full
                  bg-gradient-to-r
                  from-violet-500
                  to-indigo-500
                  rounded-full
                  transition-all duration-700
                "
                                style={{
                                    width: `${storagePercent}%`,
                                }}
                            />

                        </div>

                        <p className="text-xs text-zinc-400 mt-3">
                            {totalStored} / {storageCapacity} products stored
                        </p>

                    </div>

                </div>

                {/* WAREHOUSES */}

                <div className="mt-8">

                    <div className="flex items-center gap-2 mb-4">

                        <Warehouse
                            size={18}
                            className="text-zinc-400"
                        />

                        <h3 className="text-sm text-zinc-400">
                            Storage Centers
                        </h3>

                    </div>

                    <div className="space-y-3">

                        {warehouses.map((warehouse, index) => (

                            <div
                                key={index}
                                className="
                  bg-white/5
                  border border-white/5
                  rounded-2xl
                  px-4 py-3
                  hover:bg-white/10
                  transition-all
                "
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="font-medium">
                                            {warehouse.name}
                                        </p>

                                        <p className="text-xs text-zinc-400 mt-1">
                                            {warehouse.products} products
                                        </p>

                                    </div>

                                    <div
                                        className="
                      w-3 h-3
                      rounded-full
                      bg-green-400
                    "
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* UPGRADE */}

                <div className="mt-10">

                    <div
                        className="
              rounded-3xl
              bg-gradient-to-br
              from-violet-600
              to-indigo-600
              p-6
              shadow-2xl
              shadow-violet-500/20
            "
                    >

                        <h3 className="font-black text-xl">
                            Smart Analytics
                        </h3>

                        <p
                            className="
                text-sm
                text-white/80
                mt-3
                leading-relaxed
              "
                        >
                            Unlock AI-powered forecasting and enterprise inventory intelligence.
                        </p>

                        <button
                            className="
                mt-6
                w-full
                bg-white
                text-black
                py-3
                rounded-2xl
                font-bold
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-300
              "
                        >
                            Upgrade Plan
                        </button>

                    </div>

                    {/* PROFILE */}

                    <div
                        className="
              mt-6
              flex items-center gap-4
              border border-white/10
              bg-white/5
              rounded-2xl
              p-4
            "
                    >

                        <div
                            className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                flex items-center justify-center
                font-bold
              "
                        >
                            A
                        </div>

                        <div>

                            <h4 className="font-semibold">
                                {name}
                            </h4>

                            <p className="text-zinc-400 text-sm">
                                Administrator
                            </p>

                        </div>

                    </div>

                </div>

            </aside>

        </>
    );
};

export default Sidebar;