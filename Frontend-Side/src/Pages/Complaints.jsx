import React from 'react'
import { useEffect, useState } from "react";
import { productApi } from "./../api/productApi.js";
// import "./App.css";

const EMPTY_FORM = {
  complaintId: "",
  title: "",
  type: "",
  status: "",
  raiseBy: "",
  raisedBytitle: "",
  createdAt: "",
  updatedAt: "",
  description: "",
  photo: "",
  location: "",
};

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: "#22c55e", error: "#ef4444", info: "#6366f1" };
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        background: colors[type] || colors.info,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        fontSize: 14,
      }}
    >
      {msg}
    </div>
  );
}

// ─── Modal Form (Create / Edit) ───────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.tile]: e.target.value }));

  const submit = async () => {
    if (!form.tile || !form.location || !form.type) {
      alert("title, location aur type required hai!");
      return;
    }
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #2d2d3a",
    background: "#12121a",
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "#7c7caa",
    textTransform: "uppercase",
    letterSpacing: 1,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 520,
          border: "1px solid #2d2d3a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: "#e2e8f0" }}>
            {product ? "✏️ Product Edit Karo" : "➕ Naya Product"}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#7c7caa", fontSize: 22, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {[
            { label: "Product title *", title: "title", placeholder: "e.g. Butter Chicken" },
            { label: "location (₹) *", title: "location", placeholder: "e.g. 299", type: "number" },
            { label: "type *", title: "type", placeholder: "e.g. Main Course" },
            { label: "Description", title: "description", placeholder: "Short description..." },
            { label: "photo URL", title: "photo", placeholder: "https://..." },
            { label: "status", title: "status", placeholder: "e.g. 50", type: "number" },
          ].map(({ label, title, placeholder, type = "text" }) => (
            <div key={title}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                title={title}
                value={form[title] ?? ""}
                onChange={handle}
                placeholder={placeholder}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "1.5px solid #2d2d3a",
              background: "transparent",
              color: "#7c7caa",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: loading ? "#3d3d5c" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Saving..." : product ? "💾 Update Karo" : "✅ Create Karo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${product.title}" delete karna chahte ho?`)) return;
    setDeleting(true);
    await onDelete(product._id);
    setDeleting(false);
  };

  return (
    <div
      style={{
        background: "#1a1a2e",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #2d2d3a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 160,
          background: "#12121a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <span style={{ fontSize: 48 }}>🍽️</span>
        )}
      </div>

      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ margin: 0, fontSize: 16, color: "#e2e8f0" }}>{product.title}</h3>
          <span
            style={{
              background: "#6366f120",
              color: "#818cf8",
              padding: "2px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
              marginLeft: 8,
            }}
          >
            {product.type}
          </span>
        </div>

        {product.description && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#64748b",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>₹{product.location}</span>
          <span style={{ fontSize: 11, color: "#64748b" }}>status: {product.status ?? "N/A"}</span>
        </div>

        <div style={{ fontSize: 9, color: "#3d3d5c", fontFamily: "monospace", wordBreak: "break-all" }}>
          ID: {product._id}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #2d2d3a" }}>
        <button
          onClick={() => onEdit(product)}
          style={{
            padding: 12,
            background: "none",
            border: "none",
            color: "#6366f1",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            borderRight: "1px solid #2d2d3a",
          }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: 12,
            background: "none",
            border: "none",
            color: "#ef4444",
            fontWeight: 700,
            fontSize: 13,
            cursor: deleting ? "not-allowed" : "pointer",
          }}
        >
          {deleting ? "⏳" : "🗑️ Delete"}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function ComplainsCrud() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | product-obj
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      if (res.success) setProducts(res.data);
      else showToast(res.error || "Load fail!", "error");
    } catch {
      showToast("Server se connect nahi ho pa raha! (backend chal raha hai?)", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (form) => {
    try {
      const res = await productApi.create(form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadProducts();
      } else {
        showToast(res.error || "Create fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Create fail!", "error");
    }
  };

  const handleUpdate = async (form) => {
    try {
      const res = await productApi.update(modal._id, form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadProducts();
      } else {
        showToast(res.error || "Update fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Update fail!", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await productApi.remove(id);
      if (res.success) {
        showToast(res.message, "success");
        loadProducts();
      } else {
        showToast(res.error || "Delete fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Delete fail!", "error");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d17", fontFamily: "'Segoe UI', sans-serif", color: "#e2e8f0" }}>
      <header
        style={{
          background: "#1a1a2e",
          borderBottom: "1px solid #2d2d3a",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🍽️ Product Manager (Admin)
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>MongoDB Connected — changes yahan se DB me save hote hain</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ background: "#22c55e20", color: "#22c55e", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            📦 {products.length} Products
          </span>
          <button
            onClick={() => setModal("create")}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ➕ New Product
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 32px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Product ya type search karo..."
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "12px 16px",
            borderRadius: 10,
            border: "1.5px solid #2d2d3a",
            background: "#1a1a2e",
            color: "#e2e8f0",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      <main style={{ padding: "24px 32px" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: 80 }}>Products load ho rahe hain...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <p style={{ color: "#64748b", fontSize: 16 }}>
              {search ? "Koi product nahi mila!" : "Koi product nahi hai. Pehla product add karo!"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} onEdit={setModal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {modal && (
        <ProductModal
          product={modal === "create" ? null : modal}
          onSave={modal === "create" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
