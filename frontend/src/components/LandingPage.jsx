import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleDepotClick = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  };

  const scrollToMechanics = (e) => {
    e.preventDefault();
    const elem = document.getElementById("how-swapping-works");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-surface-container-high text-on-surface font-body-md text-body-md antialiased min-h-screen pt-16 selection:bg-denim selection:text-paper">
      <main className="w-full flex flex-col">
        <div className="max-w-[1200px] mx-auto w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-10">
          {/* ── 1. Hero Section: Split Layout ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10 border-b border-outline-variant">
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low border border-outline-variant rounded mb-4">
                <span className="w-2 h-2 rounded-full border border-secondary bg-surface-container-lowest"></span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">
                  Local physical textile registry
                </span>
              </div>

              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-on-surface mb-4 tracking-tight leading-tight">
                Give your clothes a second season
              </h1>

              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant mb-6 max-w-xl leading-relaxed">
                Exchange quality garments directly with neighbours or redeem with community points instead of buying new.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDepotClick}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-on-surface text-surface rounded font-label-lg text-label-lg font-medium transition-colors hover:bg-primary-container"
                >
                  Explore member depot
                </button>
                <button
                  onClick={scrollToMechanics}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-transparent border border-on-surface text-on-surface rounded font-label-lg text-label-lg font-medium transition-colors hover:bg-surface-container-low"
                >
                  How swapping works
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant w-full grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block font-serif font-bold text-2xl text-on-surface">1,420</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">Active pieces in orbit</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-2xl text-secondary">0 lbs</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">Virgin polyester accepted</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-2xl text-tertiary-container">24 hrs</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">Average swap turnaround</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-surface-container-low border border-outline-variant p-2 rounded">
                <div className="relative overflow-hidden bg-surface-container rounded-sm">
                  <img
                    className="w-full h-auto aspect-[4/3] object-cover object-center block"
                    alt="A curated stack of folded sustainable garments resting on a textured linen tablecloth"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALHk09NpaoeoRTjbinlDFxfccdxvkkl8qC2a7EwybWP8SF5QW7xvjDcujIGuP185E1PPGsMmaGjarODvLUDQA2iJsy3zuqk9im8oJs2bGuMS6g91E33vk7LqCliyOGFS3PM_-tH5nipQSjAObY1-vjwbus9lktod5f9Tc8XbwTg14wishB6BZ5oshr64_wpPbUQ6ucUHxF6EYBP6BnCXxoT8ZXUzEoGwWUxjAE4B-atolcX3kv-VYN"
                  />
                </div>
                <div className="mt-2 px-1 flex items-center justify-between text-on-surface-variant font-label-sm text-xs">
                  <span>Depot parcel lot #284-A</span>
                  <span>Inspected and weighed at Cascadia Hub</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. Member-Only Textile Circulation Gate (New in Stitch) ── */}
          <section className="py-8 border-b border-outline-variant">
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 md:p-12">
              <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant rounded mb-4">
                  <span className="material-symbols-outlined text-base text-tertiary-container">lock</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Depot Access Protocol
                  </span>
                </div>

                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-on-surface mb-3 tracking-tight">
                  Member-only textile circulation
                </h2>

                <p className="font-body-md text-sm sm:text-base text-on-surface-variant mb-6 max-w-xl leading-relaxed">
                  To protect garment provenance, physical dry-weights, and member trade points, our live depot inventory is reserved for registered exchange members. Sign in or request an account to browse all 1,420+ active garments, inspect fiber certificates, and propose direct swaps.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {token ? (
                    <button
                      onClick={handleDepotClick}
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-on-primary rounded font-label-lg text-label-lg font-medium transition-colors hover:bg-primary-container"
                    >
                      Open Member Closet &amp; Depot
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        state={{ from: "/dashboard" }}
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-tertiary-container text-on-tertiary rounded font-label-lg text-label-lg font-medium transition-colors hover:bg-tertiary"
                      >
                        Sign in to explore depot
                      </Link>
                      <Link
                        to="/signup"
                        state={{ from: "/dashboard" }}
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-transparent border border-on-surface text-on-surface rounded font-label-lg text-label-lg font-medium transition-colors hover:bg-surface-container-low"
                      >
                        Create free account
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* 3 Member-Only Teaser Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-outline-variant">
                {/* Card 1: Outerwear */}
                <div
                  onClick={handleDepotClick}
                  className="bg-surface-container-low border border-outline-variant rounded p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-primary transition-colors group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <span className="font-label-sm text-xs text-outline uppercase font-semibold">Outerwear Rack</span>
                    <span className="font-label-sm text-xs text-tertiary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      Member Only
                    </span>
                  </div>
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-2 group-hover:text-primary transition-colors">
                      dry_cleaning
                    </span>
                    <span className="font-serif font-bold text-2xl text-on-surface">418 Garments</span>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-1">
                      Chore coats, waxed jackets, unlined twill
                    </span>
                  </div>
                  <div className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center">
                    <span className="font-label-sm text-xs text-outline">Verified Cascadia &amp; Northwest Hubs</span>
                  </div>
                </div>

                {/* Card 2: Selvedge Denim */}
                <div
                  onClick={handleDepotClick}
                  className="bg-surface-container-low border border-outline-variant rounded p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-primary transition-colors group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <span className="font-label-sm text-xs text-outline uppercase font-semibold">Selvedge Denim &amp; Trousers</span>
                    <span className="font-label-sm text-xs text-tertiary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      Member Only
                    </span>
                  </div>
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-2 group-hover:text-primary transition-colors">
                      styler
                    </span>
                    <span className="font-serif font-bold text-2xl text-on-surface">532 Garments</span>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-1">
                      Shuttle-loomed denim, canvas chinos, work pants
                    </span>
                  </div>
                  <div className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center">
                    <span className="font-label-sm text-xs text-outline">100% Cotton · No Stretch Synthetics</span>
                  </div>
                </div>

                {/* Card 3: Knitwear */}
                <div
                  onClick={handleDepotClick}
                  className="bg-surface-container-low border border-outline-variant rounded p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:border-primary transition-colors group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <span className="font-label-sm text-xs text-outline uppercase font-semibold">Knitwear &amp; Heavy Wool</span>
                    <span className="font-label-sm text-xs text-tertiary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      Member Only
                    </span>
                  </div>
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline mb-2 group-hover:text-primary transition-colors">
                      texture
                    </span>
                    <span className="font-serif font-bold text-2xl text-on-surface">470 Garments</span>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-1">
                      Donegal tweed, Shetland wool, linen knits
                    </span>
                  </div>
                  <div className="p-1.5 bg-surface-container-lowest border border-outline-variant rounded text-center">
                    <span className="font-label-sm text-xs text-outline">De-pilled &amp; Hypoallergenic Inspected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Garment Exchange Mechanics Row ── */}
          <section id="how-swapping-works" className="p-6 bg-surface-container-lowest border border-outline-variant rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
              <div className="flex flex-col gap-1 pr-0 md:pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full border border-on-surface flex items-center justify-center font-label-sm text-xs text-on-surface font-semibold">
                    1
                  </span>
                  <span className="font-serif font-bold text-lg text-on-surface">Direct trade offer</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Propose an item-for-item trade from your registered closet. Both parties sign off on garment condition before dispatch.
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-4 md:pt-0 md:px-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full border border-on-surface flex items-center justify-center font-label-sm text-xs text-on-surface font-semibold">
                    2
                  </span>
                  <span className="font-serif font-bold text-lg text-on-surface">Point ledger system</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Don't have a matching garment? Redeem peer-verified points earned from items you have previously contributed to the network.
                </p>
              </div>

              <div className="flex flex-col gap-1 pt-4 md:pt-0 md:pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full border border-on-surface flex items-center justify-center font-label-sm text-xs text-on-surface font-semibold">
                    3
                  </span>
                  <span className="font-serif font-bold text-lg text-on-surface">Depot handoff or mail</span>
                </div>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Leave folded parcels at your nearest neighborhood depot counter or generate a zero-waste paper mailing label.
                </p>
              </div>
            </div>
          </section>

          {/* ── 4. Bottom Banner: Flat Denim Canvas CTA ── */}
          <section className="bg-primary-container text-surface p-6 md:p-10 rounded border border-outline-variant">
            <div className="max-w-3xl flex flex-col items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                <span className="font-label-sm text-xs text-on-primary-container uppercase tracking-wider font-semibold">
                  Textile circularity notice
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-surface tracking-tight leading-snug">
                Have garments hanging unworn? Clear closet space and circulate quality textiles.
              </h2>

              <p className="font-body-lg text-sm sm:text-base text-on-primary-container max-w-2xl leading-relaxed">
                Every piece registered receives physical depot verification, standardized fiber composition analysis, and a permanent trade ledger record.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleDepotClick}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-transparent border border-surface text-surface rounded font-label-lg text-sm font-medium transition-colors hover:bg-surface hover:text-primary"
                >
                  List your first item
                </button>
                <span className="font-label-sm text-xs text-on-primary-container">
                  Zero fees · 100% direct circular exchange
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── 5. Footer ── */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant mt-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-outline-variant">
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-on-surface">ReWear Ledger</span>
                <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant font-semibold">
                  VERIFIED EXCHANGE
                </span>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
                A physical-first textile exchange protocol. We circulate wearable fibers, reduce landfill dependency, and track garment provenance through point-based trade accounting.
              </p>
              <div className="flex items-center gap-2 font-label-sm text-xs text-primary-container pt-1">
                <span className="w-2 h-2 bg-secondary rounded-none"></span>
                <span>Zero virgin polyester priority · Peer-to-peer verified dry-weight exchange</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-lg text-sm text-on-surface uppercase tracking-wide font-semibold">
                Exchange Index
              </span>
              <ul className="flex flex-col gap-1 font-body-sm text-xs sm:text-sm text-on-surface-variant">
                <li>
                  <button onClick={handleDepotClick} className="hover:text-on-surface transition-colors text-left">
                    Garment Directory
                  </button>
                </li>
                <li>
                  <button onClick={scrollToMechanics} className="hover:text-on-surface transition-colors text-left">
                    Grading &amp; Fiber Standards
                  </button>
                </li>
                <li>
                  <button onClick={scrollToMechanics} className="hover:text-on-surface transition-colors text-left">
                    Neighborhood Depot Map
                  </button>
                </li>
                <li>
                  <button onClick={handleDepotClick} className="hover:text-on-surface transition-colors text-left">
                    Trade Ledger Records
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-lg text-sm text-on-surface uppercase tracking-wide font-semibold">
                Textile Care &amp; Ethics
              </span>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                All circulated garments must be laundered, de-pilled, and documented with transparent fiber disclosure tags prior to transfer handoff.
              </p>
              <div className="mt-auto font-label-sm text-xs text-outline">
                Branch Registry § 44.08 · Cascadia Hub
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-xs text-on-surface-variant">
            <span>© ReWear Community Clothing Exchange. Operating on open textile circularity principles.</span>
            <div className="flex items-center gap-3">
              <span className="hover:text-on-surface cursor-pointer">Protocol Rules</span>
              <span>·</span>
              <span className="hover:text-on-surface cursor-pointer">Depot Guidelines</span>
              <span>·</span>
              <span className="hover:text-on-surface cursor-pointer">Fiber Ledger</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}