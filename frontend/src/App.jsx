import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: "/api"
});

function App() {
    const [page, setPage] = useState("login");
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setPage("login");
    };

    if (!user) {
        return (
            <AuthPage
                page={page}
                setPage={setPage}
                setUser={setUser}
            />
        );
    }

    return (
        <Store
            user={user}
            logout={logout}
        />
    );
}

function AuthPage({ page, setPage, setUser }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (page === "register") {
                const response = await api.post("/auth/register", form);

                setMessage(response.data.message);

                setForm({
                    name: "",
                    email: "",
                    password: ""
                });

                setTimeout(() => setPage("login"), 1000);
            } else {
                const response = await api.post("/auth/login", {
                    email: form.email,
                    password: form.password
                });

                localStorage.setItem(
                    "token",
                    response.data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                setUser(response.data.user);
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="logo">amazon<span>.clone</span></div>

                <h2>
                    {page === "login"
                        ? "Sign in"
                        : "Create account"}
                </h2>

                <form onSubmit={submit}>
                    {page === "register" && (
                        <>
                            <label>Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value
                                    })
                                }
                            />
                        </>
                    )}

                    <label>Email</label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                        }
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        required
                        minLength="6"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value
                            })
                        }
                    />

                    <button type="submit">
                        {page === "login"
                            ? "Sign in"
                            : "Create your account"}
                    </button>
                </form>

                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}

                <div className="switch">
                    {page === "login" ? (
                        <>
                            New here?
                            <button
                                onClick={() => {
                                    setMessage("");
                                    setPage("register");
                                }}
                            >
                                Create your account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <button
                                onClick={() => {
                                    setMessage("");
                                    setPage("login");
                                }}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function Store({ user, logout }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.categories);
        } catch (error) {
            console.error(error);
        }
    };

    const loadProducts = async (category = "") => {
        try {
            const response = await api.get(
                category
                    ? `/products?category=${category}`
                    : "/products"
            );

            setProducts(response.data.products);
        } catch (error) {
            console.error(error);
        }
    };

    const selectCategory = (id) => {
        setSelectedCategory(id);
        loadProducts(id);
    };

    return (
        <div>
            <header className="navbar">
                <div className="logo">amazon<span>.clone</span></div>

                <div className="welcome">
                    Hello, {user.name}
                </div>

                <button
                    className="logout"
                    onClick={logout}
                >
                    Logout
                </button>
            </header>

            <section className="hero">
                <h1>Welcome to Amazon Clone</h1>
                <p>
                    Find everything you need in one place.
                </p>
            </section>

            <main>
                <h2>Categories</h2>

                <div className="categories">
                    <button
                        className={!selectedCategory ? "active" : ""}
                        onClick={() => {
                            setSelectedCategory("");
                            loadProducts();
                        }}
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={
                                String(selectedCategory) ===
                                String(category.id)
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                selectCategory(category.id)
                            }
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <h2>Products</h2>

                <div className="products">
                    {products.map((product) => (
                        <div
                            className="product"
                            key={product.id}
                        >
                            <img
                                src={product.image_url}
                                alt={product.name}
                            />

                            <div className="product-body">
                                <small>
                                    {product.category}
                                </small>

                                <h3>{product.name}</h3>

                                <p>
                                    {product.description}
                                </p>

                                <strong>
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </strong>

                                <button>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
