import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../api/config.js";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [offerMethod, setOfferMethod] = useState("swap");
  const [offerItem, setOfferItem] = useState("");
  const [proposalSent, setProposalSent] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const navigate = useNavigate();

  const fallbackProduct = {
    _id: "c-0482",
    title: "Vintage Chore Jacket in Olive Canvas",
    lot: "LOT-284-A",
    tagId: "TAG #C-0482",
    category: "Heavy Outerwear",
    price: 45,
    status: "Available",
    tare: "22.4 oz (635g)",
    standard: "Tier 1 Natural Fiber",
    intakeDate: "Oct 24 • Cascadia Depot Hub 44-A",
    inspector: "M. Vance (#44-A)",
    seal: "PASS-VERIFIED",
    description:
      "Original heavy unwashed cotton canvas chore jacket with antique brass hardware and reinforced double-needle stitched patch pockets. Zero synthetic blend detected under infrared spectrometry. Laundering verified heat treated at 140°F.",
    images: [
      "https://lh3.googleusercontent.com/aida/AEtjO1Vm9aPhK4PtbZ_Due-DLBzUTMjm-fKvt57MIkO-3DdMj3n6jcTIViuS5eNYSywHzEsvCLCCErCtXK2lWAzCJK_GnNh7fOGjVCagNeX2HaXuxUcTtMlMqp1B_HRc36JsES4kZwPm77RYUNjq7fkYaeXfOkN1vBOA6cuMKg8cmOf5bgPwpHO0A5XK0Uu1X2TeXu_VzZydW1eJc7C1PDmhs-e68mcNQSsdrvNlV98yJ5UdYi7967MBGMon8vI",
      "https://lh3.googleusercontent.com/aida/AEtjO1URtdUGehG9soHZduXIqe9Xk5aXPXDFk7SAS1OGuxxuZX8g-oL-xL7E6yoxqdldlsHBSz-ERuLu9tpceCXZr_puTny48u9riWW1Vp_UJ70A_WjtFnwsaA0cPbtAdOSsL88II-ZOE1VtKs93S-LmbgXs_VW4HFBBzSF1nX-WAKVMT-HDRIDtyHvxSTtdUVoIBnAfn1sHj71PFS5q306EWHkjanR69BqhbuTC_B4nxFudDCLjseZuQG_a5b8",
      "https://lh3.googleusercontent.com/aida/AEtjO1Vb3jUoFWd3p9MWwqi5WNDkc5N98jvPmQYCWhxxnaFUwNVeY-RrJPdw6O4PIrBW9ajIsdAPY-d_H8KL2DzMkqmiVzoIkpbErjOIDCRZRPZ31Uk7er4up5yCm03Px_WXneBYi-KKSqbqibZf5MPVjeMNMTgxzgVXVeqOc9T4tPbg4_uSqemEt-N9CNbziwc3rhQTA8tnmvWaddn8xA6Sebp_mQ_wWJ-lvb7ufpaaW_wanatInKaaKwLUyg"
    ],
    specs: [
      { label: "Raw Material", value: "100% Unbleached Duck Cotton" },
      { label: "Weave Structure", value: "2x2 Basket Duck Weave" },
      { label: "Tare Dry Weight", value: "22.4 oz / 635 grams" },
      { label: "Tensile Integrity", value: "High / Zero warp deformation" },
      { label: "Origin / Era", value: "Circa 1984 Normandy Agricultural Union" },
      { label: "Sanitization Stamp", value: "Thermal 140°F Depot Cycle" }
    ]
  };

  useEffect(() => {
    setLoading(true);
    if (!id || id === "c-0482") {
      setProduct(fallbackProduct);
      setLoading(false);
      return;
    }

    fetch(apiUrl(`/api/products/${id}`))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProduct({
            ...fallbackProduct,
            ...data,
            images: data.images && data.images.length > 0 ? data.images : fallbackProduct.images
          });
        } else {
          setProduct(fallbackProduct);
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(fallbackProduct);
        setLoading(false);
      });
  }, [id]);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setProposalError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          method: offerMethod,
          points: offerMethod === "redeem" ? product.price || 45 : undefined,
          requesterItem: offerMethod === "swap" ? offerItem : undefined
        })
      });
      if (res.ok) {
        setProposalSent(true);
        window.dispatchEvent(new Event("pointsUpdated"));
      } else {
        const data = await res.json();
        setProposalError(data.message || "Failed to submit proposal");
      }
    } catch (err) {
      setProposalError(err.message || "Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-canvas">
        <div className="flex items-center gap-3 text-primary font-serif text-lg">
          <span className="material-symbols-outlined animate-spin">sync</span>
          <span>Fetching garment provenance certificate...</span>
        </div>
      </div>
    );
  }

  const p = product || fallbackProduct;
  const currentPhoto =
    p.images && p.images[activePhotoIndex]
      ? p.images[activePhotoIndex].startsWith("http")
        ? p.images[activePhotoIndex]
        : apiUrl(`/uploads/${p.images[activePhotoIndex].split("/").pop()}`)
      : fallbackProduct.images[0];

  return (
    <div className="w-full bg-surface-container-high min-h-screen pt-16 selection:bg-denim selection:text-paper font-sans">
      {/* Top Protocol Status Bar */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant py-2.5 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Link to="/landing" className="hover:underline flex items-center gap-1 text-on-surface font-medium">
              <span>← Return to Ledger</span>
            </Link>
            <span className="text-outline">/</span>
            <span className="font-semibold text-primary">{p.tagId || "TAG #C-0482"}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-secondary font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Depot Verified • {p.lot || "LOT-284-A"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Inspection Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Manifest Header Box */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant px-2.5 py-1 rounded">
              <span className="tag-hole"></span>
              <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                {p.tagId || "TAG #C-0482"}
              </span>
            </div>
            <span className="text-outline">|</span>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              In-Depot Verified
            </span>
            <span className="text-outline hidden sm:inline">|</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
              Intake: {p.intakeDate || "Oct 24 • Cascadia Depot Hub 44-A"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-label-sm font-label-sm text-on-surface-variant">
            <span>Tare: <strong className="text-on-surface">{p.tare || "22.4 oz"}</strong></span>
            <span>Standard: <strong className="text-on-surface">{p.standard || "Tier 1"}</strong></span>
            <span>Inspection: <strong className="text-secondary font-semibold">{p.seal || "PASS"}</strong></span>
          </div>
        </div>

        {/* 2-Column Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photographic Inspection & Spectrometry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Primary Inspection Photo Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-2 rounded relative">
              <div className="absolute top-4 left-4 z-10 bg-surface-container-lowest/95 border border-outline-variant px-2.5 py-1 rounded flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">
                  Live Depot Inspection
                </span>
              </div>

              <div className="aspect-[4/3] w-full bg-surface-container overflow-hidden border border-outline-variant rounded flex items-center justify-center">
                <img
                  src={currentPhoto}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-2 pt-3 flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
                <span>Proof of laundering: Verified thermal sanitization (140°F)</span>
                <span className="text-secondary font-semibold">Node 44-A Certified</span>
              </div>

              {/* Photo Thumbnails */}
              {p.images && p.images.length > 1 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-outline-variant">
                  {p.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-16 h-16 rounded overflow-hidden border ${
                        activePhotoIndex === idx ? "border-2 border-primary" : "border-outline-variant opacity-70"
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fiber & Physical Specification Ledger */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-outline-variant">
                <span className="tag-hole"></span>
                <h3 className="font-serif font-bold text-lg text-on-surface">
                  Fiber Spectrometry & Structural Ledger
                </h3>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 font-body-sm text-body-sm">
                {(p.specs || fallbackProduct.specs).map((spec, i) => (
                  <div key={i} className="flex flex-col pb-2 border-b border-outline-variant/60">
                    <dt className="font-label-sm text-xs text-outline uppercase tracking-wider">
                      {spec.label}
                    </dt>
                    <dd className="font-medium text-on-surface mt-0.5">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right Column: Garment Details & Swap Action Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header & Description Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
              <div className="flex items-center justify-between text-label-sm text-outline uppercase tracking-wider">
                <span>{p.category || "Heavy Outerwear"}</span>
                <span>{p.lot || "LOT-284-A"}</span>
              </div>

              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-on-surface tracking-tight leading-snug">
                {p.title}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="font-serif font-bold text-3xl text-tertiary-container">
                  {p.price || 45} Points
                </span>
                <span className="text-on-surface-variant font-body-sm">or direct physical exchange</span>
              </div>

              <div className="p-3 bg-surface-container-low border-l-4 border-l-secondary rounded text-body-sm text-on-surface-variant leading-relaxed">
                {p.description}
              </div>

              {/* Swap Proposal Form */}
              <div className="pt-4 border-t border-outline-variant">
                <h4 className="font-serif font-semibold text-lg text-on-surface mb-3">
                  Initiate Exchange Proposal
                </h4>

                {proposalSent ? (
                  <div className="p-4 bg-secondary-container text-on-secondary-container border border-secondary rounded text-center">
                    <span className="material-symbols-outlined text-2xl mb-1">check_circle</span>
                    <p className="font-headline-sm font-semibold">Proposal Submitted to Depot</p>
                    <p className="font-body-sm text-xs mt-1">
                      Our intake inspectors have registered your offer. You will receive drop-off instructions.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProposal} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOfferMethod("swap")}
                        className={`p-2.5 border rounded text-left ${
                          offerMethod === "swap"
                            ? "border-primary bg-surface-container border-l-4 border-l-primary font-semibold"
                            : "border-outline-variant bg-surface-container-lowest"
                        }`}
                      >
                        <span className="font-label-md text-xs text-on-surface block">Physical Garment</span>
                        <span className="text-[11px] text-outline">Trade clothing piece</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferMethod("redeem")}
                        className={`p-2.5 border rounded text-left ${
                          offerMethod === "redeem"
                            ? "border-primary bg-surface-container border-l-4 border-l-primary font-semibold"
                            : "border-outline-variant bg-surface-container-lowest"
                        }`}
                      >
                        <span className="font-label-md text-xs text-on-surface block">Redeem Points</span>
                        <span className="text-[11px] text-outline">{p.price || 45} community pts</span>
                      </button>
                    </div>

                    {offerMethod === "swap" && (
                      <div className="flex flex-col gap-1">
                        <label className="font-label-md text-xs font-medium text-on-surface uppercase tracking-wider">
                          Item you will deposit at depot:
                        </label>
                        <input
                          type="text"
                          required
                          value={offerItem}
                          onChange={(e) => setOfferItem(e.target.value)}
                          placeholder="e.g. Wool Overcoat or Selvedge Jeans"
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    )}

                    {proposalError && (
                      <div className="p-2.5 bg-error-container/40 border border-error text-error text-xs rounded">
                        {proposalError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 mt-2 bg-primary text-on-primary rounded font-label-lg text-sm hover:bg-primary-container transition-colors"
                    >
                      {offerMethod === "swap" ? "Submit Exchange Proposal" : "Claim Piece via Points"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Official Inspection Authority Card */}
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary p-5 rounded">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs font-semibold text-primary uppercase tracking-widest">
                  Depot Certification Seal
                </span>
                <span className="text-secondary font-bold font-serif text-sm">#CERT-9941</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed">
                Inspected by <strong className="text-on-surface">{p.inspector || "Inspector M. Vance (#44-A)"}</strong> at
                Cascadia Regional Depot Node. Optical density and thermal purification completed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
