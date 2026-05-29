import { useEffect, useMemo, useState } from "react";
import { getSettings } from "../utils/settings";
import api from "../services/api";

import {
    Search,
    Plus,
    Package,
    Boxes,
    Trash2,
    Pencil,
    AlertTriangle,
    Warehouse,
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

import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

import { motion } from "framer-motion";

const PRODUCTS_PER_PAGE = 8;

const Products = () => {

    const [products, setProducts] = useState([]);

    const settings = getSettings();

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [editOpen, setEditOpen] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        warehouse: "",
        price: "",
        stock: "",
    });

    // FETCH PRODUCTS

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const res = await api.get("/products");

            setProducts(res.data);

        } catch (error) {

            toast.error("Failed to fetch products");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = async () => {

        try {

            await api.put(
                `/products/${editingProduct.id}`,
                editingProduct
            );

            toast.success(
                "Product updated successfully"
            );

            setEditOpen(false);

            fetchProducts();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Update failed"
            );
        }
    };

    // CREATE PRODUCT

    const handleCreate = async () => {

        try {

            await api.post("/products", {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            });

            toast.success(
                "Product created successfully"
            );

            setOpen(false);

            setFormData({
                name: "",
                sku: "",
                category: "",
                warehouse: "",
                price: "",
                stock: "",
            });

            fetchProducts();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Something went wrong"
            );
        }
    };

    // DELETE PRODUCT

    const handleDelete = async (id) => {

        try {

            await api.delete(`/products/${id}`);

            toast.success("Product deleted");

            fetchProducts();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Delete failed"
            );
        }
    };

    // FILTERED PRODUCTS

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    }, [
        products,
        search,
        selectedCategory,
    ]);

    // PAGINATION

    const totalPages = Math.ceil(
        filteredProducts.length /
        PRODUCTS_PER_PAGE
    );

    const paginatedProducts =
        filteredProducts.slice(
            (currentPage - 1) *
            PRODUCTS_PER_PAGE,

            currentPage *
            PRODUCTS_PER_PAGE
        );

    // ANALYTICS

    const totalInventoryValue =
        products.reduce(
            (acc, product) =>
                acc +
                (product.price * product.stock),
            0
        );

    const lowStockProducts =
        products.filter(
            (product) =>
                product.stock < settings.inventorySettings.lowStockThreshold
        );

    const categories = [
        "All",
        ...new Set(
            products.map(
                (p) => p.category
            )
        ),
    ];

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
                            <Boxes size={28} />
                        </div>

                        <div>

                            <h1 className="text-5xl font-black tracking-tight">
                                Products
                            </h1>

                            <p className="text-zinc-400 mt-1">
                                Enterprise inventory management
                            </p>

                        </div>

                    </div>

                </div>

                {/* ADD PRODUCT */}

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
                            Add Product
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
                                Create Product
                            </DialogTitle>

                        </DialogHeader>

                        <div className="space-y-4 mt-4">

                            <Input
                                placeholder="Product Name"
                                value={formData.name}
                                className="bg-black/30 border-white/10 h-12"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="SKU"
                                value={formData.sku}
                                className="bg-black/30 border-white/10 h-12"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sku: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="Category"
                                value={formData.category}
                                className="bg-black/30 border-white/10 h-12"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                            />

                            <Input
                                placeholder="Warehouse"
                                value={formData.warehouse}
                                className="bg-black/30 border-white/10 h-12"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        warehouse: e.target.value,
                                    })
                                }
                            />

                            <div className="grid grid-cols-2 gap-4">

                                <Input
                                    placeholder="Price"
                                    type="number"
                                    value={formData.price}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                />

                                <Input
                                    placeholder="Stock"
                                    type="number"
                                    value={formData.stock}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stock: e.target.value,
                                        })
                                    }
                                />

                            </div>

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
                                Create Product
                            </button>

                        </div>

                    </DialogContent>

                </Dialog>

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
                                Edit Product
                            </DialogTitle>

                        </DialogHeader>

                        {editingProduct && (

                            <div className="space-y-4 mt-4">

                                <Input
                                    value={editingProduct.name}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <Input
                                    value={editingProduct.sku}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            sku: e.target.value,
                                        })
                                    }
                                />

                                <Input
                                    value={editingProduct.category}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            category: e.target.value,
                                        })
                                    }
                                />

                                <Input
                                    value={editingProduct.warehouse}
                                    className="bg-black/30 border-white/10 h-12"
                                    onChange={(e) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            warehouse: e.target.value,
                                        })
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">

                                    <Input
                                        type="number"
                                        value={editingProduct.price}
                                        className="bg-black/30 border-white/10 h-12"
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                price: Number(e.target.value),
                                            })
                                        }
                                    />

                                    <Input
                                        type="number"
                                        value={editingProduct.stock}
                                        className="bg-black/30 border-white/10 h-12"
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                stock: Number(e.target.value),
                                            })
                                        }
                                    />

                                </div>

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
                        Total Products
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                        {products.length}
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
                        Inventory Value
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                        $
                        {totalInventoryValue.toLocaleString()}
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

                        <AlertTriangle
                            size={18}
                            className="text-red-400"
                        />

                        <p className="text-zinc-400">
                            Low Stock
                        </p>

                    </div>

                    <h2 className="text-4xl font-black mt-3 text-red-400">
                        {lowStockProducts.length}
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
                        placeholder="Search products..."
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

                {/* CATEGORY FILTER */}

                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(
                            e.target.value
                        )
                    }
                    className="
            bg-white/5
            border border-white/10
            rounded-2xl
            px-5
            py-4
            outline-none
          "
                >

                    {categories.map((category) => (

                        <option
                            key={category}
                            value={category}
                            className="bg-[#18181b]"
                        >
                            {category}
                        </option>

                    ))}

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

                        <thead
                            className="
                bg-white/5
                sticky top-0
              "
                        >

                            <tr className="text-left text-zinc-400">

                                <th className="p-6">
                                    Product
                                </th>

                                <th>SKU</th>

                                <th>Category</th>

                                <th>Warehouse</th>

                                <th>Price</th>

                                <th>Stock</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                [...Array(5)].map((_, index) => (

                                    <tr key={index}>

                                        <td
                                            colSpan={7}
                                            className="p-5"
                                        >

                                            <Skeleton
                                                height={60}
                                                baseColor="#18181b"
                                                highlightColor="#27272a"
                                                borderRadius={20}
                                            />

                                        </td>

                                    </tr>

                                ))

                            ) : paginatedProducts.length > 0 ? (

                                paginatedProducts.map((product) => (

                                    <motion.tr
                                        key={product.id}
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        className="
                      border-t border-white/5
                      hover:bg-white/5
                    "
                                    >

                                        {/* PRODUCT */}

                                        <td className="p-5">

                                            <div className="flex items-center gap-4">

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

                                                <div>

                                                    <p className="font-semibold text-lg">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-zinc-400 text-sm">
                                                        Inventory Product
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* SKU */}

                                        <td className="font-medium">
                                            {product.sku}
                                        </td>

                                        {/* CATEGORY */}

                                        <td>

                                            <span
                                                className="
                          px-3 py-1
                          rounded-full
                          bg-violet-500/10
                          text-violet-300
                          text-sm
                        "
                                            >
                                                {product.category}
                                            </span>

                                        </td>

                                        {/* WAREHOUSE */}

                                        <td>

                                            <div className="flex items-center gap-2">

                                                <Warehouse
                                                    size={16}
                                                    className="text-zinc-400"
                                                />

                                                {product.warehouse}

                                            </div>

                                        </td>

                                        {/* PRICE */}

                                        <td className="font-semibold text-green-400">
                                            $
                                            {product.price}
                                        </td>

                                        {/* STOCK */}

                                        <td>

                                            <span
                                                className={`
                          px-4 py-2
                          rounded-full
                          text-sm
                          font-medium

                          ${product.stock > 20
                                                        ? `
                                bg-green-500/20
                                text-green-400
                              `
                                                        : `
                                bg-red-500/20
                                text-red-400
                              `
                                                    }
                        `}
                                            >
                                                {product.stock} units
                                            </span>

                                        </td>

                                        {/* ACTIONS */}

                                        <td>

                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => {

                                                        setEditingProduct(product);

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
                                                        handleDelete(product.id)
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

                                    </motion.tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan={7}>

                                        <div className="flex flex-col items-center py-20">

                                            <div
                                                className="
                          w-24 h-24
                          rounded-full
                          bg-white/5
                          flex items-center justify-center
                          mb-5
                        "
                                            >
                                                <Package size={34} />
                                            </div>

                                            <h3 className="text-2xl font-bold">
                                                No Products Found
                                            </h3>

                                            <p className="text-zinc-400 mt-2">
                                                Create your first inventory product.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

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
          "
                >

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

                </div>

            )}

        </motion.div>
    );
};

export default Products;