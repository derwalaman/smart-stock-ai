import api from "../services/api";

import {
    useEffect,
    useState,
} from "react";

import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Database,
    Palette,
    Package,
    Save,
    Download,
} from "lucide-react";

import { motion } from "framer-motion";

import { toast } from "sonner";

const Settings = () => {

    // PROFILE

    const [profile, setProfile] =
        useState({
            name: "Ankit Dabad",
            email: "ankitdabad01@google.com",
            company: "SmartStock AI",
            role: "Administrator",
        });

    // INVENTORY SETTINGS

    const [inventorySettings, setInventorySettings] =
        useState({
            lowStockThreshold: 20,
            warehouseCapacity: 3000,
            autoStockAlerts: true,
        });

    // ORDER SETTINGS

    const [orderSettings, setOrderSettings] =
        useState({
            autoCompleteOrders: false,
            taxPercentage: 18,
            shippingCharge: 50,
        });

    // NOTIFICATIONS

    const [notifications, setNotifications] =
        useState({
            emailAlerts: true,
            lowStockAlerts: true,
            revenueReports: true,
            newOrders: true,
        });

    // LOAD SETTINGS

    useEffect(() => {

        const savedSettings =
            localStorage.getItem(
                "smartstock-settings"
            );

        if (savedSettings) {

            const parsed =
                JSON.parse(savedSettings);

            setInventorySettings(
                parsed.inventorySettings
            );

            setOrderSettings(
                parsed.orderSettings
            );

            setNotifications(
                parsed.notifications
            );
        }

    }, []);

    // SAVE SETTINGS

    const handleSave = () => {

        localStorage.setItem(
            "smartstock-settings",

            JSON.stringify({
                profile,
                inventorySettings,
                orderSettings,
                notifications,
            })
        );

        toast.success(
            "Settings saved successfully"
        );
    };

    // EXPORT DATA

    const handleExport = async () => {

        try {

            const [
                productsRes,
                ordersRes,
                customersRes,
            ] = await Promise.all([
                api.get("/products"),
                api.get("/orders"),
                api.get("/customers"),
            ]);

            const data = {
                products: productsRes.data,
                orders: ordersRes.data,
                customers: customersRes.data,
            };

            const blob = new Blob(
                [JSON.stringify(data, null, 2)],
                {
                    type: "application/json",
                }
            );

            const url =
                URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;

            a.download =
                "smartstock-backup.json";

            a.click();

            URL.revokeObjectURL(url);

            toast.success(
                "Backup exported successfully"
            );

        } catch (error) {

            toast.error(
                "Export failed"
            );
        }
    };

    return (

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-10"
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
              "
                        >
                            <SettingsIcon size={28} />
                        </div>

                        <div>

                            <h1 className="text-5xl font-black">
                                Settings
                            </h1>

                            <p className="text-zinc-400 mt-1">
                                System configuration & preferences
                            </p>

                        </div>

                    </div>

                </div>

                {/* SAVE BUTTON */}

                <button
                    onClick={handleSave}
                    className="
            flex items-center gap-2
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            px-6 py-3
            rounded-2xl
            font-semibold
            hover:scale-105
            transition-all
          "
                >
                    <Save size={18} />
                    Save Settings
                </button>

            </div>

            {/* GRID */}

            <div
                className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
            >

                {/* PROFILE */}

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <User size={22} />

                        <h2 className="text-2xl font-bold">
                            Profile Settings
                        </h2>

                    </div>

                    <div className="space-y-4">

                        <input
                            value={profile.name}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    name: e.target.value,
                                })
                            }
                            className="
                w-full
                bg-black/30
                border border-white/10
                rounded-2xl
                px-4 py-3
                outline-none
              "
                        />

                        <input
                            value={profile.email}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    email: e.target.value,
                                })
                            }
                            className="
                w-full
                bg-black/30
                border border-white/10
                rounded-2xl
                px-4 py-3
                outline-none
              "
                        />

                        <input
                            value={profile.company}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    company: e.target.value,
                                })
                            }
                            className="
                w-full
                bg-black/30
                border border-white/10
                rounded-2xl
                px-4 py-3
                outline-none
              "
                        />

                    </div>

                </div>

                {/* INVENTORY SETTINGS */}

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <Package size={22} />

                        <h2 className="text-2xl font-bold">
                            Inventory Settings
                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div>

                            <label className="text-zinc-400 text-sm">
                                Low Stock Threshold
                            </label>

                            <input
                                type="number"
                                value={
                                    inventorySettings.lowStockThreshold
                                }
                                onChange={(e) =>
                                    setInventorySettings({
                                        ...inventorySettings,
                                        lowStockThreshold:
                                            e.target.value,
                                    })
                                }
                                className="
                  mt-2
                  w-full
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  outline-none
                "
                            />

                        </div>

                        <div>

                            <label className="text-zinc-400 text-sm">
                                Warehouse Capacity
                            </label>

                            <input
                                type="number"
                                value={
                                    inventorySettings.warehouseCapacity
                                }
                                onChange={(e) =>
                                    setInventorySettings({
                                        ...inventorySettings,
                                        warehouseCapacity:
                                            e.target.value,
                                    })
                                }
                                className="
                  mt-2
                  w-full
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  outline-none
                "
                            />

                        </div>

                        <div className="flex items-center justify-between">

                            <p>
                                Auto Stock Alerts
                            </p>

                            <button
                                onClick={() =>
                                    setInventorySettings({
                                        ...inventorySettings,
                                        autoStockAlerts:
                                            !inventorySettings.autoStockAlerts,
                                    })
                                }
                                className={`
                  w-14 h-8
                  rounded-full
                  transition-all

                  ${inventorySettings.autoStockAlerts
                                        ? "bg-green-500"
                                        : "bg-zinc-700"
                                    }
                `}
                            >

                                <div
                                    className={`
                    w-6 h-6
                    bg-white
                    rounded-full
                    mt-1
                    transition-all

                    ${inventorySettings.autoStockAlerts
                                            ? "ml-7"
                                            : "ml-1"
                                        }
                  `}
                                />

                            </button>

                        </div>

                    </div>

                </div>

                {/* ORDER SETTINGS */}

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <Database size={22} />

                        <h2 className="text-2xl font-bold">
                            Order Preferences
                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div>

                            <label className="text-zinc-400 text-sm">
                                Tax Percentage
                            </label>

                            <input
                                type="number"
                                value={
                                    orderSettings.taxPercentage
                                }
                                onChange={(e) =>
                                    setOrderSettings({
                                        ...orderSettings,
                                        taxPercentage:
                                            e.target.value,
                                    })
                                }
                                className="
                  mt-2
                  w-full
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  outline-none
                "
                            />

                        </div>

                        <div>

                            <label className="text-zinc-400 text-sm">
                                Shipping Charge
                            </label>

                            <input
                                type="number"
                                value={
                                    orderSettings.shippingCharge
                                }
                                onChange={(e) =>
                                    setOrderSettings({
                                        ...orderSettings,
                                        shippingCharge:
                                            e.target.value,
                                    })
                                }
                                className="
                  mt-2
                  w-full
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  outline-none
                "
                            />

                        </div>

                    </div>

                </div>

                {/* NOTIFICATIONS */}

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <Bell size={22} />

                        <h2 className="text-2xl font-bold">
                            Notifications
                        </h2>

                    </div>

                    <div className="space-y-5">

                        {Object.entries(
                            notifications
                        ).map(([key, value]) => (

                            <div
                                key={key}
                                className="
                  flex items-center
                  justify-between
                "
                            >

                                <p className="capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                </p>

                                <button
                                    onClick={() =>
                                        setNotifications({
                                            ...notifications,
                                            [key]: !value,
                                        })
                                    }
                                    className={`
                    w-14 h-8
                    rounded-full
                    transition-all

                    ${value
                                            ? "bg-green-500"
                                            : "bg-zinc-700"
                                        }
                  `}
                                >

                                    <div
                                        className={`
                      w-6 h-6
                      bg-white
                      rounded-full
                      mt-1
                      transition-all

                      ${value
                                                ? "ml-7"
                                                : "ml-1"
                                            }
                    `}
                                    />

                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            {/* SYSTEM INFO */}

            <div
                className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
          mt-6
        "
            >

                <div className="flex items-center gap-3 mb-6">

                    <Shield size={22} />

                    <h2 className="text-2xl font-bold">
                        System Information
                    </h2>

                </div>

                <div
                    className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-5
          "
                >

                    {[
                        {
                            label: "API Status",
                            value: "Operational",
                        },
                        {
                            label: "Database",
                            value: "Connected",
                        },
                        {
                            label: "Version",
                            value: "v2.0.1",
                        },
                        {
                            label: "Server",
                            value: "Online",
                        },
                    ].map((item, index) => (

                        <div
                            key={index}
                            className="
                bg-black/20
                border border-white/10
                rounded-2xl
                p-5
              "
                        >

                            <p className="text-zinc-400 text-sm">
                                {item.label}
                            </p>

                            <h3 className="text-xl font-bold mt-2">
                                {item.value}
                            </h3>

                        </div>

                    ))}

                </div>

            </div>

            {/* DATA EXPORT */}

            <div
                className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
          mt-6
        "
            >

                <div className="flex items-center gap-3 mb-6">

                    <Download size={22} />

                    <h2 className="text-2xl font-bold">
                        Data Management
                    </h2>

                </div>

                <div
                    className="
            flex flex-col
            md:flex-row
            gap-4
          "
                >

                    <button
                        onClick={handleExport}
                        className="
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              px-6 py-3
              rounded-2xl
              font-semibold
            "
                    >
                        Export Orders CSV
                    </button>

                    <button
                        onClick={handleExport}
                        className="
              bg-white/5
              border border-white/10
              px-6 py-3
              rounded-2xl
              font-semibold
            "
                    >
                        Backup Database
                    </button>

                </div>

            </div>

        </motion.div>
    );
};

export default Settings;