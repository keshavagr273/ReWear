import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("listings");
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Edit Modals
  const [editUser, setEditUser] = useState(null);
  const [editListing, setEditListing] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "listings") fetchListings();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, token]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
      // Demo fallback users
      setUsers([
        { _id: "u-101", name: "Elena Rostova", email: "elena@cascadia.org", role: "user", createdAt: "2026-08-10" },
        { _id: "u-102", name: "Inspector M. Vance", email: "vance@depot44a.org", role: "admin", createdAt: "2026-06-01" },
        { _id: "u-103", name: "Tariq Mansoor", email: "tariq@textiletrade.org", role: "user", createdAt: "2026-08-28" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch listings");
      setListings(data);
    } catch (err) {
      setError(err.message);
      setListings([
        {
          _id: "p-0482",
          title: "Vintage Chore Jacket in Olive Canvas",
          price: 45,
          status: "available",
          description: "100% Cotton Canvas • Cascadia Hub Verified",
          owner: { name: "Elena Rostova", email: "elena@cascadia.org" }
        },
        {
          _id: "p-1904",
          title: "14oz Selvedge Denim Jeans",
          price: 50,
          status: "swap",
          description: "100% Ring-Spun Cotton • Red-line selvedge",
          owner: { name: "Tariq Mansoor", email: "tariq@textiletrade.org" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data);
    } catch (err) {
      setError(err.message);
      setOrders([
        {
          _id: "ord-8812",
          product: { title: "Vintage French Chore Jacket", _id: "p-0482" },
          requester: { name: "Elena Rostova", email: "elena@cascadia.org" },
          owner: { name: "Tariq Mansoor", email: "tariq@textiletrade.org" },
          method: "swap",
          requesterItem: "Selvedge Denim 14oz",
          status: "pending",
          createdAt: "2026-09-06"
        },
        {
          _id: "ord-8813",
          product: { title: "Aran Cable Knit Wool Sweater", _id: "p-0711" },
          requester: { name: "Ankur Verma", email: "ankur@community.org" },
          owner: { name: "Elena Rostova", email: "elena@cascadia.org" },
          method: "redeem",
          points: 60,
          status: "accepted",
          createdAt: "2026-09-05"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Confirm deletion of member record from registry?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Remove this garment from community rotation?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.message);
      setListings(listings.filter((l) => l._id !== id));
    }
  };

  const handleUserSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${editUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update member");
      setUsers(users.map((u) => (u._id === data._id ? data : u)));
      setEditUser(null);
    } catch (err) {
      alert(err.message);
      setUsers(users.map((u) => (u._id === editUser._id ? editUser : u)));
      setEditUser(null);
    }
  };

  const handleListingSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/products/${editListing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editListing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update listing");
      setListings(listings.map((l) => (l._id === data._id ? data : l)));
      setEditListing(null);
    } catch (err) {
      alert(err.message);
      setListings(listings.map((l) => (l._id === editListing._id ? editListing : l)));
      setEditListing(null);
    }
  };

  const handleOrderSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/orders/${editOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: editOrder.status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update order");
      setOrders(orders.map((o) => (o._id === data._id ? data : o)));
      setEditOrder(null);
    } catch (err) {
      alert(err.message);
      setOrders(orders.map((o) => (o._id === editOrder._id ? editOrder : o)));
      setEditOrder(null);
    }
  };

  return (
    <div className="w-full bg-surface-container-high text-on-surface min-h-screen pt-16 font-sans selection:bg-denim selection:text-paper">
      {/* Depot Administration Operational Ribbon */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container border border-outline-variant rounded font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Depot Terminal § Cascadia Hub 44-A
            </span>
            <span className="text-outline">•</span>
            <span className="text-on-surface font-medium">Protocol Rulebook v18.4</span>
            <span className="text-outline">•</span>
            <span>Active Station: Dry Tare Bay #02</span>
          </div>
          <div className="flex items-center gap-4 text-label-sm">
            <span>
              Duty Officer: <strong className="text-on-surface font-semibold">Inspector M. Vance (#44-A)</strong>
            </span>
            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-semibold rounded">
              CALIBRATION SYNCED
            </span>
          </div>
        </div>
      </div>

      {/* Page Masthead */}
      <div className="w-full bg-surface-container border-b border-outline-variant py-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-tertiary-container uppercase tracking-widest font-semibold">
                <span>Depot Verification Log</span>
                <span>/</span>
                <span>Batch Ledger § B-190</span>
              </div>
              <h1 className="font-serif font-bold text-3xl text-on-surface tracking-tight">
                Depot Ledger &amp; Exchange Administration
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant max-w-2xl">
                Physical garment verification, natural fiber spectrometry, tare dry-weight audits, and settlement
                clearing for the Cascadia regional textile node.
              </p>
            </div>

            {/* Terminal Stats */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <div className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Queue</span>
                <span className="font-headline-sm text-lg text-on-surface font-semibold">18 Items</span>
              </div>
              <div className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Dispatched</span>
                <span className="font-headline-sm text-lg text-on-surface font-semibold">42 Today</span>
              </div>
              <div className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Purity Index</span>
                <span className="font-headline-sm text-lg text-secondary font-semibold">99.4%</span>
              </div>
            </div>
          </div>

          {/* Navigation Ledger Subtabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-outline-variant pb-px">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 border-b-2 font-label-lg text-label-lg whitespace-nowrap transition-colors ${
                activeTab === "listings"
                  ? "border-primary text-on-surface font-semibold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Intake &amp; Garment Registry ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 border-b-2 font-label-lg text-label-lg whitespace-nowrap transition-colors ${
                activeTab === "orders"
                  ? "border-primary text-on-surface font-semibold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Transfer Orders &amp; Dispatches ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 border-b-2 font-label-lg text-label-lg whitespace-nowrap transition-colors ${
                activeTab === "users"
                  ? "border-primary text-on-surface font-semibold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Member Registry &amp; Roles ({users.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-error-container/40 border-l-4 border-error text-error text-xs rounded">
            {error}
          </div>
        )}

        {/* Tab 1: Listings */}
        {activeTab === "listings" && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="tag-hole"></span>
                <h3 className="font-serif font-bold text-xl text-on-surface">Intake Garment Catalog</h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Auto-Depot Clearance Active
              </span>
            </div>

            {loading ? (
              <p className="font-body-sm text-on-surface-variant py-4">Fetching batch catalog...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-sm text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant font-label-sm text-xs text-outline uppercase tracking-wider bg-surface-container-low">
                      <th className="py-2.5 px-3">Garment / Tag</th>
                      <th className="py-2.5 px-3">Custodian</th>
                      <th className="py-2.5 px-3">Value</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {listings.map((item) => (
                      <tr key={item._id} className="hover:bg-surface-container transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-serif font-semibold text-on-surface">{item.title}</p>
                          <p className="font-label-sm text-xs text-outline">TAG #{item._id.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">
                          {item.owner ? item.owner.name || item.owner.email : "Community Member"}
                        </td>
                        <td className="py-3 px-3 font-semibold text-tertiary-container">{item.price} pts</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-secondary-container text-on-secondary-container font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setEditListing(item)}
                              className="px-2.5 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(item._id)}
                              className="px-2.5 py-1 text-xs border border-error text-error rounded hover:bg-error-container/20"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="tag-hole"></span>
                <h3 className="font-serif font-bold text-xl text-on-surface">Depot Transfer &amp; Dispatch Ledger</h3>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">Escrow Clearing</span>
            </div>

            {loading ? (
              <p className="font-body-sm text-on-surface-variant py-4">Loading transfer orders...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-sm text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant font-label-sm text-xs text-outline uppercase tracking-wider bg-surface-container-low">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Garment Involved</th>
                      <th className="py-2.5 px-3">Transfer Parties</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Depot Status</th>
                      <th className="py-2.5 px-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-surface-container transition-colors">
                        <td className="py-3 px-3 font-label-sm text-xs font-semibold">
                          ORD-#{ord._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-3 font-serif font-semibold text-on-surface">
                          {ord.product ? ord.product.title : "Catalog Garment"}
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant text-xs">
                          <div>Req: {ord.requester ? ord.requester.name : "Member"}</div>
                          <div>Own: {ord.owner ? ord.owner.name : "Custodian"}</div>
                        </td>
                        <td className="py-3 px-3 text-xs">
                          {ord.method === "swap" ? (
                            <span className="text-primary font-medium">Swap ({ord.requesterItem || "Item"})</span>
                          ) : (
                            <span className="text-tertiary-container font-medium">Redeem ({ord.points || 45} pts)</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-surface-container border border-outline-variant font-semibold">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setEditOrder(ord)}
                            className="px-2.5 py-1 text-xs bg-primary text-on-primary rounded hover:bg-primary-container"
                          >
                            Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Users */}
        {activeTab === "users" && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="tag-hole"></span>
                <h3 className="font-serif font-bold text-xl text-on-surface">Community Member Roster</h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Total Members: {users.length}
              </span>
            </div>

            {loading ? (
              <p className="font-body-sm text-on-surface-variant py-4">Fetching registry roster...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body-sm text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant font-label-sm text-xs text-outline uppercase tracking-wider bg-surface-container-low">
                      <th className="py-2.5 px-3">Member Handle</th>
                      <th className="py-2.5 px-3">Email Address</th>
                      <th className="py-2.5 px-3">Points Ledger</th>
                      <th className="py-2.5 px-3">Depot Clearance / Role</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-surface-container transition-colors">
                        <td className="py-3 px-3 font-serif font-semibold text-on-surface">{u.name}</td>
                        <td className="py-3 px-3 text-on-surface-variant text-xs">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-tertiary-container bg-surface-container px-2 py-0.5 rounded border border-outline-variant text-xs">
                            {u.points ?? 0} pts
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container text-on-surface border border-outline-variant"
                            }`}
                          >
                            {u.role === "admin" ? "Depot Inspector (Admin)" : "Member Custodian"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setEditUser(u)}
                              className="px-2.5 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-2.5 py-1 text-xs border border-error text-error rounded hover:bg-error-container/20"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-on-surface max-w-md w-full p-6 rounded relative">
            <h3 className="font-serif font-bold text-xl mb-3">Edit Member Record</h3>
            <form onSubmit={handleUserSave} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Name"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              />
              <input
                type="email"
                required
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              />
              <label className="font-label-sm text-xs text-outline uppercase tracking-wider">
                Community Points Balance:
              </label>
              <input
                type="number"
                min="0"
                value={editUser.points ?? 0}
                onChange={(e) => setEditUser({ ...editUser, points: Number(e.target.value) })}
                placeholder="Points Balance"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              />
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              >
                <option value="user">Member (User)</option>
                <option value="admin">Depot Inspector (Admin)</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-3 py-1.5 border border-outline-variant rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editListing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-on-surface max-w-md w-full p-6 rounded relative">
            <h3 className="font-serif font-bold text-xl mb-3">Modify Garment Record</h3>
            <form onSubmit={handleListingSave} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={editListing.title}
                onChange={(e) => setEditListing({ ...editListing, title: e.target.value })}
                placeholder="Title"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              />
              <input
                type="number"
                required
                value={editListing.price}
                onChange={(e) => setEditListing({ ...editListing, price: Number(e.target.value) })}
                placeholder="Points"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              />
              <select
                value={editListing.status}
                onChange={(e) => setEditListing({ ...editListing, status: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              >
                <option value="available">Available in Circulation</option>
                <option value="swap">Active Swap Offer</option>
                <option value="sold">Cleared / Dispatched</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditListing(null)}
                  className="px-3 py-1.5 border border-outline-variant rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-on-surface max-w-md w-full p-6 rounded relative">
            <h3 className="font-serif font-bold text-xl mb-3">Update Transfer Status</h3>
            <form onSubmit={handleOrderSave} className="flex flex-col gap-3">
              <label className="font-label-sm text-xs text-outline uppercase tracking-wider">
                Select Order Lifecycle Stage:
              </label>
              <select
                value={editOrder.status}
                onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm"
              >
                <option value="pending">Pending Depot Intake</option>
                <option value="accepted">Accepted / Verification Cleared</option>
                <option value="rejected">Rejected / Quarantine</option>
                <option value="completed">Completed / Escrow Settled</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditOrder(null)}
                  className="px-3 py-1.5 border border-outline-variant rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
