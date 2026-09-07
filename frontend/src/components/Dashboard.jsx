import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../api/config.js";

export default function Dashboard() {
  const [garments, setGarments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [dropTagModalOpen, setDropTagModalOpen] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [userData, setUserData] = useState(null);

  // New listing form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Heavy Outerwear");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(45);
  const [status, setStatus] = useState("available");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (token) {
          // Fetch user profile for points and name
          const userRes = await fetch(apiUrl("/api/user/me"), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const user = await userRes.json();
            setUserData(user);
          }

          const ordRes = await fetch(apiUrl("/api/orders/my"), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (ordRes.ok) {
            const ords = await ordRes.json();
            if (Array.isArray(ords) && ords.length > 0) setOrders(ords);
          }
        }

        const prodRes = await fetch(apiUrl("/api/products"));
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) setGarments(prods);
        }
      } catch {
        // Fallback demo items handled below if empty
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormError("");
    setUploading(true);

    try {
      let uploadedFilePath = "";
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const upRes = await fetch(apiUrl("/api/upload"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          uploadedFilePath = upData.filePath;
        }
      }

      const res = await fetch(apiUrl("/api/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          status,
          category,
          images: uploadedFilePath ? [uploadedFilePath] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create garment record");

      setGarments([data, ...garments]);
      setFormSuccess(true);
      // Re-fetch user data to reflect +10 pts awarded for listing
      const refreshed = await fetch(apiUrl("/api/user/me"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshed.ok) {
        setUserData(await refreshed.json());
        window.dispatchEvent(new Event("pointsUpdated"));
      }
      setTimeout(() => {
        setListModalOpen(false);
        setFormSuccess(false);
        setTitle("");
        setDescription("");
        setSelectedFile(null);
      }, 1500);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const demoItems = [
    {
      _id: "c-0482",
      title: "Vintage French Chore Jacket in Olive Canvas",
      tagId: "TAG #C-0482",
      lot: "LOT-284-A",
      fiber: "100% Duck Cotton • 22.4 oz",
      price: 45,
      status: "available",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1Vm9aPhK4PtbZ_Due-DLBzUTMjm-fKvt57MIkO-3DdMj3n6jcTIViuS5eNYSywHzEsvCLCCErCtXK2lWAzCJK_GnNh7fOGjVCagNeX2HaXuxUcTtMlMqp1B_HRc36JsES4kZwPm77RYUNjq7fkYaeXfOkN1vBOA6cuMKg8cmOf5bgPwpHO0A5XK0Uu1X2TeXu_VzZydW1eJc7C1PDmhs-e68mcNQSsdrvNlV98yJ5UdYi7967MBGMon8vI",
    },
    {
      _id: "d-1904",
      title: "14oz Selvedge Denim Jeans (Red-Line Hem)",
      tagId: "TAG #D-1904",
      lot: "LOT-312-B",
      fiber: "100% Ring-Spun Cotton • 14.0 oz",
      price: 50,
      status: "swap",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1URtdUGehG9soHZduXIqe9Xk5aXPXDFk7SAS1OGuxxuZX8g-oL-xL7E6yoxqdldlsHBSz-ERuLu9tpceCXZr_puTny48u9riWW1Vp_UJ70A_WjtFnwsaA0cPbtAdOSsL88II-ZOE1VtKs93S-LmbgXs_VW4HFBBzSF1nX-WAKVMT-HDRIDtyHvxSTtdUVoIBnAfn1sHj71PFS5q306EWHkjanR69BqhbuTC_B4nxFudDCLjseZuQG_a5b8",
    },
    {
      _id: "k-0711",
      title: "Heavyweight Aran Cable Knit Wool Sweater",
      tagId: "TAG #K-0711",
      lot: "LOT-108-C",
      fiber: "100% Raw Unbleached Wool • 31.0 oz",
      price: 60,
      status: "available",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1Vb3jUoFWd3p9MWwqi5WNDkc5N98jvPmQYCWhxxnaFUwNVeY-RrJPdw6O4PIrBW9ajIsdAPY-d_H8KL2DzMkqmiVzoIkpbErjOIDCRZRPZ31Uk7er4up5yCm03Px_WXneBYi-KKSqbqibZf5MPVjeMNMTgxzgVXVeqOc9T4tPbg4_uSqemEt-N9CNbziwc3rhQTA8tnmvWaddn8xA6Sebp_mQ_wWJ-lvb7ufpaaW_wanatInKaaKwLUyg",
    },
  ];

  const displayedGarments = garments.length > 0 ? garments : demoItems;

  return (
    <div className="w-full bg-surface-container-high min-h-screen pt-16 selection:bg-denim selection:text-paper font-sans">
      {/* Top Ledger Ribbon */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant py-2.5 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="uppercase tracking-wider font-semibold text-primary">
              Member Registry Node #44-A
            </span>
            <span className="text-outline">·</span>
            <span>Intake Protocol Rulebook v18.4</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Depot Verification: <strong className="text-secondary font-semibold">Active</strong></span>
            <span className="text-outline">·</span>
            <span>Tare Bay: <strong>#02 Calibrated</strong></span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Masthead Header with CTA Buttons & Member Profile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-outline-variant flex-shrink-0 bg-surface-container">
              <img
                src={userData?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"}
                alt="Member Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-tertiary-container uppercase tracking-widest font-semibold mb-0.5">
                <span>Member Registry</span>
                <span>/</span>
                <span className="text-secondary font-semibold">
                  {userData?.role === 'admin' ? 'Depot Inspector' : 'Verified Member'}
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-on-surface tracking-tight">
                {userData?.name ? `${userData.name}'s Closet & Profile` : "Member Closet & Profile"}
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5 max-w-xl">
                {userData?.email && <span className="font-medium text-on-surface">{userData.email} • </span>}
                Track physical garments in circulation, generate authenticated drop tags, and manage proposals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setSelectedGarment(displayedGarments[0]);
                setDropTagModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-on-surface bg-surface-container-lowest font-label-lg text-label-lg text-on-surface rounded hover:bg-surface-container transition-colors"
            >
              <span className="tag-hole"></span>
              <span>Generate depot drop tag</span>
            </button>
            <button
              onClick={() => setListModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-tertiary-container font-label-lg text-label-lg text-on-tertiary rounded hover:opacity-95 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>List a garment</span>
            </button>
          </div>
        </div>

        {/* Three Flat Ledger Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tile 1: Items in circulation */}
          <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary p-4 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="tag-hole"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Garments in rotation
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
                #CLOSET-ACTIVE
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="font-serif font-bold text-3xl text-on-surface">{displayedGarments.length}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">pieces cataloged</span>
            </div>
            <div className="pt-2 mt-2 border-t border-outline-variant font-body-sm text-xs text-on-surface-variant flex items-center justify-between">
              <span>{displayedGarments.filter(g => g.status !== "sold").length} available for swap</span>
              <span className="text-outline">·</span>
              <span className="text-secondary font-semibold">100% natural fiber</span>
            </div>
          </div>

          {/* Tile 2: Physical transfers — dynamic */}
          <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-tertiary-container p-4 rounded flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="tag-hole"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Physical Transfers
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-container bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
                #DEPOT-TRANSIT
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="font-serif font-bold text-3xl text-on-surface">{orders.length}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">active proposals</span>
            </div>
            <div className="pt-2 mt-2 border-t border-outline-variant font-body-sm text-xs text-on-surface-variant flex items-center justify-between">
              <span>{orders.filter(o => o.status === "pending").length} pending</span>
              <span className="text-outline">·</span>
              <span className="text-primary font-semibold">{orders.filter(o => o.status === "accepted").length} accepted</span>
            </div>
          </div>

          {/* Tile 3: Points Balance — fully dynamic */}
          {(() => {
            const pts = userData?.points ?? 0;
            const tier = pts >= 300 ? "Tier 3 Elder"
              : pts >= 150 ? "Tier 2 Member"
              : pts >= 50  ? "Tier 1 Member"
              : "New Member";
            const equiv = Math.floor(pts / 45);
            return (
              <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-mustard p-4 rounded flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="tag-hole"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Community Points
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-mustard bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
                    #LEDGER-VERIFIED
                  </span>
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <span className="font-serif font-bold text-3xl text-on-surface">{pts}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">pts earned</span>
                </div>
                <div className="pt-2 mt-2 border-t border-outline-variant font-body-sm text-xs text-on-surface-variant flex items-center justify-between">
                  <span>Equiv: ~{equiv} garment{equiv !== 1 ? "s" : ""}</span>
                  <span className="text-outline">·</span>
                  <span className="text-mustard font-semibold">{tier}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Wardrobe Table Section */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="tag-hole"></span>
              <h2 className="font-serif font-bold text-xl text-on-surface">Cataloged Wardrobe Registry</h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Showing {displayedGarments.length} logged garments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body-sm text-body-sm">
              <thead>
                <tr className="border-b border-outline-variant font-label-sm text-label-sm text-outline uppercase tracking-wider bg-surface-container-low">
                  <th className="py-2.5 px-3">Garment & Lot ID</th>
                  <th className="py-2.5 px-3">Fiber Spec</th>
                  <th className="py-2.5 px-3">Exchange Value</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {displayedGarments.map((g) => {
                  const img =
                    g.image ||
                    (g.images && g.images[0]
                      ? g.images[0].startsWith("http")
                        ? g.images[0]
                        : apiUrl(`/uploads/${g.images[0].split("/").pop()}`)
                      : demoItems[0].image);

                  return (
                    <tr key={g._id} className="hover:bg-surface-container transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={g.title}
                            className="w-12 h-12 object-cover border border-outline-variant rounded"
                          />
                          <div>
                            <p className="font-serif font-semibold text-on-surface">{g.title}</p>
                            <p className="font-label-sm text-xs text-outline">
                              TAG #{g._id.slice(-6).toUpperCase()} • LOT-Cascadia
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">
                        {g.fiber || "100% Verified Cotton Canvas • 22.4 oz"}
                      </td>
                      <td className="py-3 px-3 font-semibold text-tertiary-container">
                        {g.status === "swap" ? "Swap Only" : `${g.price || 45} pts`}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-sm font-label-sm ${
                            g.status === "available"
                              ? "bg-secondary-container text-on-secondary-container font-semibold"
                              : "bg-surface-container text-primary font-medium"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          {g.status === "available" ? "In Circulation" : "Swap Reserved"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedGarment(g);
                              setDropTagModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container font-label-md"
                          >
                            Tag
                          </button>
                          <Link
                            to={`/product/${g._id}`}
                            className="px-2.5 py-1 text-xs bg-primary text-on-primary rounded hover:bg-primary-container font-label-md"
                          >
                            Inspect
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Transfer Proposals Log */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="tag-hole"></span>
              <h2 className="font-serif font-bold text-xl text-on-surface">Depot Exchange Pipeline</h2>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              Live Protocol Sync
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 border border-outline-variant border-l-4 border-l-primary bg-surface-container-low rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-label-sm text-outline">
                  <span className="tag-hole"></span>
                  <span>TRANSFER #TR-9942 • LOT #LOT-284-A</span>
                </div>
                <h4 className="font-serif font-semibold text-lg text-on-surface mt-1">
                  Vintage Chore Jacket ↔ Selvedge Denim 14oz
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Partner: <strong className="text-on-surface">Elena Rostova</strong> • Depot Node: Cascadia Hub 44-A
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-surface-container border border-outline-variant text-primary text-xs font-semibold rounded">
                  Awaiting Depot Drop
                </span>
                <button
                  onClick={() => {
                    setSelectedGarment(displayedGarments[0]);
                    setDropTagModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-primary text-on-primary text-xs rounded hover:bg-primary-container"
                >
                  Print Tag
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* List a Garment Modal */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-on-surface max-w-lg w-full p-6 rounded relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setListModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface material-symbols-outlined"
            >
              close
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="tag-hole"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                New Garment Registration
              </span>
            </div>

            <h3 className="font-serif font-bold text-2xl text-on-surface mb-1">List a Piece for Exchange</h3>
            <p className="font-body-sm text-xs text-on-surface-variant mb-4">
              Enter garment metadata and upload photos. An authenticated drop tag will be minted for depot inspection.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-error-container/40 border-l-4 border-error text-error text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-secondary-container text-on-secondary-container border-l-4 border-secondary text-xs">
                Garment registered! Tag generated and logged in ledger.
              </div>
            )}

            <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                  Garment Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 1970s Wool Hunting Overcoat"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Heavy Outerwear">Heavy Outerwear</option>
                    <option value="Selvedge Denim">Selvedge Denim</option>
                    <option value="Knitwear & Wool">Knitwear & Wool</option>
                    <option value="Workwear Tops">Workwear Tops</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                    Points Value
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                  Fiber Details & Condition Notes
                </label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention fiber composition (e.g. 100% Wool), tare dry weight, repair history, and measurements..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                  Upload Garment Photo
                </label>
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="border-2 border-dashed border-outline-variant hover:border-primary p-4 rounded text-center cursor-pointer bg-surface-container-low transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-2xl text-outline mb-1">upload_file</span>
                  <p className="font-label-sm text-xs text-on-surface">
                    {selectedFile ? selectedFile.name : "Click to select garment photo (JPEG, PNG)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant mt-2">
                <button
                  type="button"
                  onClick={() => setListModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-label-md font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-primary text-on-primary rounded text-label-md font-label-md hover:bg-primary-container"
                >
                  {uploading ? "Registering..." : "Mint Drop Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authenticated Depot Drop Tag Modal */}
      {dropTagModalOpen && selectedGarment && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-paper border-2 border-ink max-w-sm w-full p-6 rounded relative shadow-none">
            <button
              onClick={() => setDropTagModalOpen(false)}
              className="absolute top-4 right-4 text-ink/60 hover:text-ink material-symbols-outlined"
            >
              close
            </button>

            {/* Swing Tag Box */}
            <div className="border border-line p-4 rounded bg-paper flex flex-col items-center text-center relative mt-2">
              <div className="w-4 h-4 rounded-full border-2 border-line mb-3 bg-canvas"></div>
              <p className="font-label-sm text-[10px] tracking-widest text-ink/60 uppercase font-semibold">
                REWEAR CONSIGNMENT DEPOT TAG
              </p>
              <h3 className="font-serif font-bold text-xl text-ink mt-1">
                {selectedGarment.tagId || `TAG #${selectedGarment._id.slice(-6).toUpperCase()}`}
              </h3>
              <p className="font-body-sm text-xs text-ink/70 mt-1">{selectedGarment.title}</p>
              <div className="w-full my-3 border-b border-dashed border-line"></div>
              <div className="w-full flex items-center justify-between text-xs text-ink/80 font-label-md">
                <span>INTAKE HUB:</span>
                <strong>Cascadia 44-A</strong>
              </div>
              <div className="w-full flex items-center justify-between text-xs text-ink/80 font-label-md mt-1">
                <span>ESTIMATED PTS:</span>
                <strong>{selectedGarment.price || 45} PTS</strong>
              </div>
              <div className="w-full flex items-center justify-between text-xs text-ink/80 font-label-md mt-1">
                <span>SEAL CODE:</span>
                <span className="text-moss font-semibold">#PASS-VERIFIED</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-ink text-paper text-xs font-label-lg rounded hover:bg-denim"
              >
                Print Swing Tag
              </button>
              <button
                onClick={() => setDropTagModalOpen(false)}
                className="py-2 px-3 border border-line text-xs font-label-lg rounded hover:bg-canvas"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}