import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { getSettings } from "../utils/settings";
import api from "../services/api";

import {
    ShoppingCart,
    Plus,
    Search,
    Package,
    AlertTriangle,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { motion } from "framer-motion";

const Orders = () => {

    const [orders, setOrders] = useState([]);

    const settings = getSettings();

    const [products, setProducts] = useState([]);

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("All");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [open, setOpen] = useState(false);

    const [selectedCustomer, setSelectedCustomer] =
        useState("");

    const [selectedProduct, setSelectedProduct] =
        useState("");

    const [quantity, setQuantity] = useState(1);

    const ORDERS_PER_PAGE = 10;

    // FETCH DATA

    const fetchData = async () => {

        try {

            const [
                ordersRes,
                productsRes,
                customersRes,
            ] = await Promise.all([
                api.get("/orders"),
                api.get("/products"),
                api.get("/customers"),
            ]);

            setOrders(ordersRes.data);

            setProducts(productsRes.data);

            setCustomers(customersRes.data);

        } catch (error) {

            toast.error("Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // CREATE ORDER

    const handleStatusUpdate = async (
        orderId,
        status
    ) => {

        try {

            await api.patch(
                `/orders/${orderId}/status`,
                null,
                {
                    params: { status }
                }
            );

            toast.success(
                "Order status updated"
            );

            fetchData();

        } catch (error) {

            toast.error(
                "Failed to update order status"
            );
        }
    };

    const handleCreateOrder = async () => {

        try {

            if (
                !selectedCustomer ||
                !selectedProduct
            ) {

                toast.error(
                    "Please select customer and product"
                );

                return;
            }

            await api.post("/orders", {
                customer_id: Number(selectedCustomer),

                items: [
                    {
                        product_id: Number(selectedProduct),
                        quantity: Number(quantity),
                    },
                ],
            });

            toast.success(
                "Order created successfully"
            );

            setOpen(false);

            setSelectedCustomer("");

            setSelectedProduct("");

            setQuantity(1);

            fetchData();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Failed to create order"
            );
        }
    };

    // CURRENT PRODUCT

    const currentProduct =
        products.find(
            (p) =>
                p.id === Number(selectedProduct)
        );

    // FILTERED ORDERS

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const matchesSearch =
                String(order.id)
                    .includes(search);

            const matchesStatus =
                selectedStatus === "All" ||
                order.status === selectedStatus;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        orders,
        search,
        selectedStatus,
    ]);

    // PAGINATION

    const totalPages = Math.ceil(
        filteredOrders.length /
        ORDERS_PER_PAGE
    );

    const paginatedOrders =
        filteredOrders.slice(
            (currentPage - 1) *
            ORDERS_PER_PAGE,

            currentPage *
            ORDERS_PER_PAGE
        );

    // ANALYTICS

    // ORDER SETTINGS

    const taxPercentage =
        Number(
            settings.orderSettings.taxPercentage
        );

    const shippingCharge =
        Number(
            settings.orderSettings.shippingCharge
        );

    // ANALYTICS

    const totalRevenue =
        orders
            .filter(
                (order) =>
                    order.status != "Cancelled"
            )
            .reduce(
            (acc, order) => {

                const subtotal =
                    order.total_price;

                const tax =
                    subtotal *
                    (taxPercentage / 100);

                return (
                    acc +
                    subtotal +
                    tax +
                    shippingCharge
                );

            },
            0
        );

    const pendingOrders =
        orders.filter(
            (order) =>
                order.status === "Pending"
        );

    const completedOrders =
        orders.filter(
            (order) =>
                order.status === "Completed"
        );

    const cancelledOrders =
        orders.filter(
            (order) =>
                order.status === "Cancelled"
        );

    const averageOrderValue =
        orders.length > 0
            ? (
                totalRevenue /
                orders.length
            ).toFixed(2)
            : 0;

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
                            <ShoppingCart size={28} />
                        </div>

                        <div>

                            <h1 className="text-5xl font-black">
                                Orders
                            </h1>

                            <p className="text-zinc-400 mt-1">
                                Enterprise order management
                            </p>

                        </div>

                    </div>

                </div>

                {/* CREATE ORDER */}

                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >

                    <DialogTrigger asChild>

                        <button
                            className="
                flex items-center gap-2
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                px-5 py-3
                rounded-2xl
                font-semibold
                hover:scale-105
                transition-all
              "
                        >
                            <Plus size={18} />
                            Create Order
                        </button>

                    </DialogTrigger>

                    <DialogContent
                        className="
              bg-[#18181b]
              border border-white/10
              text-white
              rounded-3xl
            "
                    >

                        <DialogHeader>

                            <DialogTitle className="text-3xl font-black">
                                Create New Order
                            </DialogTitle>

                        </DialogHeader>

                        <div className="space-y-5 mt-4">

                            {/* CUSTOMER */}

                            <select
                                value={selectedCustomer}
                                onChange={(e) =>
                                    setSelectedCustomer(
                                        e.target.value
                                    )
                                }
                                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-black/30
                  border border-white/10
                  px-4
                  outline-none
                "
                            >

                                <option value="">
                                    Select Customer
                                </option>

                                {customers.map((customer) => (

                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                        className="bg-[#18181b]"
                                    >
                                        {customer.name}
                                    </option>

                                ))}

                            </select>

                            {/* PRODUCT */}

                            <select
                                value={selectedProduct}
                                onChange={(e) =>
                                    setSelectedProduct(
                                        e.target.value
                                    )
                                }
                                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-black/30
                  border border-white/10
                  px-4
                  outline-none
                "
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {products.map((product) => (

                                    <option
                                        key={product.id}
                                        value={product.id}
                                        className="bg-[#18181b]"
                                    >
                                        {product.name}
                                    </option>

                                ))}

                            </select>

                            {/* PRODUCT INFO */}

                            {currentProduct && (

                                <div
                                    className="
                    bg-white/5
                    border border-white/10
                    rounded-2xl
                    p-5
                  "
                                >

                                    <div className="flex items-center gap-3">

                                        <Package size={20} />

                                        <div>

                                            <h3 className="font-semibold">
                                                {currentProduct.name}
                                            </h3>

                                            <p className="text-zinc-400 text-sm">
                                                SKU: {currentProduct.sku}
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        className="
                      grid grid-cols-2
                      gap-4 mt-5
                    "
                                    >

                                        <div>

                                            <p className="text-zinc-400 text-sm">
                                                Price
                                            </p>

                                            <h4 className="text-xl font-bold text-green-400">
                                                ${currentProduct.price}
                                            </h4>

                                        </div>

                                        <div>

                                            <p className="text-zinc-400 text-sm">
                                                Available Stock
                                            </p>

                                            <h4
                                                className={`
                          text-xl font-bold

                          ${currentProduct.stock > 20
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                    }
                        `}
                                            >
                                                {currentProduct.stock}
                                            </h4>

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* QUANTITY */}

                            <Input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setQuantity(e.target.value)
                                }
                            />

                            {/* STOCK WARNING */}

                            {currentProduct &&
                                quantity > currentProduct.stock && (

                                    <div
                                        className="
                    flex items-center gap-2
                    bg-red-500/10
                    border border-red-500/20
                    text-red-400
                    rounded-2xl
                    p-4
                  "
                                    >

                                        <AlertTriangle size={18} />

                                        Insufficient stock available

                                    </div>

                                )}

                            {/* TOTAL */}

                            {currentProduct && (

                                <div
                                    className="
                    bg-white/5
                    rounded-2xl
                    p-5
                    flex items-center justify-between
                  "
                                >

                                    <p className="text-zinc-400">
                                        Total Price
                                    </p>

                                    <h3 className="text-3xl font-black text-green-400">
                                        $
                                        {(
                                            currentProduct.price *
                                            quantity
                                        ).toFixed(2)}
                                    </h3>

                                </div>

                            )}

                            <button
                                disabled={
                                    currentProduct &&
                                    quantity > currentProduct.stock
                                }
                                onClick={handleCreateOrder}
                                className="
                  w-full
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-600
                  py-3
                  rounded-2xl
                  font-semibold
                  disabled:opacity-50
                "
                            >
                                Create Order
                            </button>

                        </div>

                    </DialogContent>

                </Dialog>

            </div>

            {/* ANALYTICS */}

            <div
                className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-8
        "
            >

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <p className="text-zinc-400">
                        Total Orders
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                        {orders.length}
                    </h2>

                </div>

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <p className="text-zinc-400">
                        Revenue
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-green-400">
                        $
                        {totalRevenue.toLocaleString()}
                    </h2>

                </div>

                {/* AVG ORDER */}

                <div
                    className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
        "
                >

                    <p className="text-zinc-400">
                        Avg Order Value
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-violet-400">
                        ${averageOrderValue}
                    </h2>

                </div>

                <div
                    className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
        "
                >

                    <p className="text-zinc-400">
                        Completed Orders
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-green-400">
                        {completedOrders.length}
                    </h2>

                </div>

                <div
                    className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
        "
                >

                    <p className="text-zinc-400">
                        Cancelled Orders
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-green-400">
                        {cancelledOrders.length}
                    </h2>

                </div>

                <div
                    className="
            bg-white/5
            border border-white/10
            rounded-3xl
            p-6
          "
                >

                    <p className="text-zinc-400">
                        Pending Orders
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-yellow-400">
                        {pendingOrders.length}
                    </h2>

                </div>

            </div>

            {/* SEARCH + FILTER */}

            <div
                className="
          flex flex-col
          lg:flex-row
          gap-4
          mb-8
        "
            >

                {/* SEARCH */}

                <div
                    className="
            flex items-center gap-3
            bg-white/5
            border border-white/10
            rounded-2xl
            px-5 py-4
            flex-1
          "
                >

                    <Search
                        size={20}
                        className="text-zinc-400"
                    />

                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="
              bg-transparent
              outline-none
              w-full
              text-white
            "
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {/* STATUS FILTER */}

                <select
                    value={selectedStatus}
                    onChange={(e) => {

                        setSelectedStatus(
                            e.target.value
                        );

                        setCurrentPage(1);
                    }}
                    className="
            bg-white/5
            border border-white/10
            rounded-2xl
            px-5
            py-4
            outline-none
          "
                >

                    <option
                        value="All"
                        className="bg-[#18181b]"
                    >
                        All Status
                    </option>

                    <option
                        value="Completed"
                        className="bg-[#18181b]"
                    >
                        Completed
                    </option>

                    <option
                        value="Pending"
                        className="bg-[#18181b]"
                    >
                        Pending
                    </option>

                    <option
                        value="Cancelled"
                        className="bg-[#18181b]"
                    >
                        Cancelled
                    </option>

                    <option
                        value="Shipped"
                        className="bg-[#18181b]"
                    >
                        Shipped
                    </option>

                </select>

            </div>

            {/* TABLE */}

            <div
                className="
          bg-white/5
          border border-white/10
          rounded-3xl
          overflow-hidden
        "
            >

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-white/5">

                            <tr className="text-left text-zinc-400">

                                <th className="p-6">
                                    Order ID
                                </th>

                                <th>Status</th>

                                <th>Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedOrders.map((order) => (

                                <tr
                                    key={order.id}
                                    className="
                    border-t border-white/5
                    hover:bg-white/5
                    transition-all
                  "
                                >

                                    <td className="p-6 font-semibold">
                                        #{order.id}
                                    </td>

                                    {/* STATUS */}

                                    <td>

                                        <div className="flex items-center gap-3">

                                            <span
                                                className={`
                px-4 py-2
                rounded-full
                text-sm
                font-medium

                ${order.status === "Completed"
                                                        ? `
                            bg-green-500/20
                            text-green-400
                        `
                                                        : order.status === "Pending"
                                                            ? `
                            bg-yellow-500/20
                            text-yellow-400
                        `
                                                            : order.status === "Shipped"
                                                                ? `
                            bg-blue-500/20
                            text-blue-400
                        `
                                                                : `
                            bg-red-500/20
                            text-red-400
                        `
                                                    }
            `}
                                            >
                                                {order.status}
                                            </span>

                                            {/* STATUS SELECT */}

                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusUpdate(
                                                        order.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="
                bg-black/30
                border border-white/10
                rounded-xl
                px-3 py-2
                text-sm
                outline-none
            "
                                            >

                                                <option
                                                    value="Pending"
                                                    className="bg-[#18181b]"
                                                >
                                                    Pending
                                                </option>

                                                <option
                                                    value="Completed"
                                                    className="bg-[#18181b]"
                                                >
                                                    Completed
                                                </option>

                                                <option
                                                    value="Shipped"
                                                    className="bg-[#18181b]"
                                                >
                                                    Shipped
                                                </option>

                                                <option
                                                    value="Cancelled"
                                                    className="bg-[#18181b]"
                                                >
                                                    Cancelled
                                                </option>

                                            </select>

                                        </div>

                                    </td>

                                    {/* TOTAL */}

                                    <td className="font-bold text-green-400">
                                        $
                                        {order.total_price}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

                <div
                    className="
            flex items-center justify-center
            gap-3
            mt-8
            flex-wrap
          "
                >

                    {/* PREVIOUS */}

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }
                        className="
              px-5 py-3
              rounded-2xl
              bg-white/5
              border border-white/10
              disabled:opacity-40
            "
                    >
                        Previous
                    </button>

                    {/* PAGE NUMBERS */}

                    {[...Array(totalPages)].map((_, index) => (

                        <button
                            key={index}
                            onClick={() =>
                                setCurrentPage(index + 1)
                            }
                            className={`
                w-11 h-11
                rounded-2xl
                transition-all

                ${currentPage === index + 1
                                    ? `
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                    `
                                    : `
                      bg-white/5
                      hover:bg-white/10
                    `
                                }
              `}
                        >
                            {index + 1}
                        </button>

                    ))}

                    {/* NEXT */}

                    <button
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            setCurrentPage(
                                currentPage + 1
                            )
                        }
                        className="
              px-5 py-3
              rounded-2xl
              bg-white/5
              border border-white/10
              disabled:opacity-40
            "
                    >
                        Next
                    </button>

                </div>

            )}

        </motion.div>
    );
};

export default Orders;