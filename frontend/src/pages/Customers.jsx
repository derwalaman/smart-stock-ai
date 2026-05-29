import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../services/api";

import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    Trash2,
    Pencil,
    UserPlus,
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

const CUSTOMERS_PER_PAGE = 10;

const Customers = () => {

    const [customers, setCustomers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [editingCustomer, setEditingCustomer] =
        useState(null);

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            phone: "",
        });

    // FETCH CUSTOMERS

    const fetchCustomers = async () => {

        try {

            const res = await api.get(
                "/customers"
            );

            setCustomers(res.data);

        } catch (error) {

            toast.error(
                "Failed to fetch customers"
            );
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // CREATE CUSTOMER

    const handleCreate = async () => {

        try {

            await api.post("/customers", formData);

            toast.success(
                "Customer created successfully"
            );

            setOpen(false);

            setFormData({
                name: "",
                email: "",
                phone: "",
            });

            fetchCustomers();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Failed to create customer"
            );
        }
    };

    // EDIT CUSTOMER

    const handleEdit = async () => {

        try {

            await api.put(
                `/customers/${editingCustomer.id}`,
                editingCustomer
            );

            toast.success(
                "Customer updated successfully"
            );

            setEditOpen(false);

            fetchCustomers();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Update failed"
            );
        }
    };

    // DELETE CUSTOMER

    const handleDelete = async (id) => {

        try {

            await api.delete(
                `/customers/${id}`
            );

            toast.success(
                "Customer deleted successfully"
            );

            fetchCustomers();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Delete failed"
            );
        }
    };

    // FILTERED CUSTOMERS

    const filteredCustomers =
        useMemo(() => {

            return customers.filter(
                (customer) => {

                    return (
                        customer.name
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||

                        customer.email
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                    );
                }
            );

        }, [customers, search]);

    // PAGINATION

    const totalPages = Math.ceil(
        filteredCustomers.length /
        CUSTOMERS_PER_PAGE
    );

    const paginatedCustomers =
        filteredCustomers.slice(
            (currentPage - 1) *
            CUSTOMERS_PER_PAGE,

            currentPage *
            CUSTOMERS_PER_PAGE
        );

    // ANALYTICS

    const gmailUsers =
        customers.filter(
            (customer) =>
                customer.email.includes(
                    "@gmail.com"
                )
        );

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
                            <Users size={28} />
                        </div>

                        <div>

                            <h1 className="text-5xl font-black">
                                Customers
                            </h1>

                            <p className="text-zinc-400 mt-1">
                                Enterprise customer management
                            </p>

                        </div>

                    </div>

                </div>

                {/* CREATE CUSTOMER */}

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
                            Add Customer
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
                                Create Customer
                            </DialogTitle>

                        </DialogHeader>

                        <div className="space-y-4 mt-4">

                            <Input
                                placeholder="Customer Name"
                                value={formData.name}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="Email"
                                value={formData.email}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="Phone"
                                value={formData.phone}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                            />

                            <button
                                onClick={handleCreate}
                                className="
                  w-full
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-600
                  py-3
                  rounded-2xl
                  font-semibold
                "
                            >
                                Create Customer
                            </button>

                        </div>

                    </DialogContent>

                </Dialog>

            </div>

            {/* EDIT DIALOG */}

            <Dialog
                open={editOpen}
                onOpenChange={setEditOpen}
            >

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
                            Edit Customer
                        </DialogTitle>

                    </DialogHeader>

                    {editingCustomer && (

                        <div className="space-y-4 mt-4">

                            <Input
                                value={editingCustomer.name}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setEditingCustomer({
                                        ...editingCustomer,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <Input
                                value={editingCustomer.email}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setEditingCustomer({
                                        ...editingCustomer,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <Input
                                value={editingCustomer.phone}
                                className="
                  bg-black/30
                  border-white/10
                  h-12
                "
                                onChange={(e) =>
                                    setEditingCustomer({
                                        ...editingCustomer,
                                        phone: e.target.value,
                                    })
                                }
                            />

                            <button
                                onClick={handleEdit}
                                className="
                  w-full
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-600
                  py-3
                  rounded-2xl
                  font-semibold
                "
                            >
                                Save Changes
                            </button>

                        </div>

                    )}

                </DialogContent>

            </Dialog>

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
                        Total Customers
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                        {customers.length}
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
                        Gmail Users
                    </p>

                    <h2 className="text-4xl font-black mt-3 text-green-400">
                        {gmailUsers.length}
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

                    <div className="flex items-center gap-2">

                        <UserPlus
                            size={18}
                            className="text-violet-400"
                        />

                        <p className="text-zinc-400">
                            Active Customers
                        </p>

                    </div>

                    <h2 className="text-4xl font-black mt-3 text-violet-400">
                        {customers.length}
                    </h2>

                </div>

            </div>

            {/* SEARCH */}

            <div
                className="
          flex items-center gap-3
          bg-white/5
          border border-white/10
          rounded-2xl
          px-5 py-4
          mb-8
        "
            >

                <Search
                    size={20}
                    className="text-zinc-400"
                />

                <input
                    type="text"
                    placeholder="Search customers..."
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
                                    Customer
                                </th>

                                <th>Email</th>

                                <th>Phone</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedCustomers.map((customer) => (

                                <tr
                                    key={customer.id}
                                    className="
                    border-t border-white/5
                    hover:bg-white/5
                    transition-all
                  "
                                >

                                    {/* CUSTOMER */}

                                    <td className="p-6">

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
                                                <Users size={20} />
                                            </div>

                                            <div>

                                                <p className="font-semibold">
                                                    {customer.name}
                                                </p>

                                                <p className="text-zinc-400 text-sm">
                                                    Premium Customer
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* EMAIL */}

                                    <td>

                                        <div className="flex items-center gap-2">

                                            <Mail
                                                size={16}
                                                className="text-zinc-400"
                                            />

                                            {customer.email}

                                        </div>

                                    </td>

                                    {/* PHONE */}

                                    <td>

                                        <div className="flex items-center gap-2">

                                            <Phone
                                                size={16}
                                                className="text-zinc-400"
                                            />

                                            {customer.phone}

                                        </div>

                                    </td>

                                    {/* ACTIONS */}

                                    <td>

                                        <div className="flex items-center gap-3">

                                            <button
                                                onClick={() => {

                                                    setEditingCustomer(customer);

                                                    setEditOpen(true);
                                                }}
                                                className="
                          w-10 h-10
                          rounded-xl
                          bg-white/5
                          hover:bg-white/10
                          flex items-center justify-center
                        "
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(customer.id)
                                                }
                                                className="
                          w-10 h-10
                          rounded-xl
                          bg-red-500/10
                          hover:bg-red-500/20
                          text-red-400
                          flex items-center justify-center
                        "
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

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

export default Customers;
