import React from "react";
import { Link } from "react-router-dom";

export default function LoadingPage() {
  return (
    <div className="w-full bg-canvas min-h-screen pt-16 font-sans selection:bg-denim selection:text-paper">
      {/* Top Protocol Status Bar */}
      <div className="w-full bg-[#E5E0D5] border-b border-line py-2.5 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm text-ink/70">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-rust skel-pulse"></span>
            <span className="tracking-wide uppercase font-semibold text-denim">
              Textile Verification Protocol § 18.4
            </span>
            <span className="text-line">·</span>
            <span className="italic text-ink/70 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              Fetching garment provenance and dry-weight certificates...
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-line">Depot Node:</span>
              <span className="skel-block skel-pulse w-24 h-3.5 inline-block"></span>
            </div>
            <span className="text-line">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-line">Scale Seal:</span>
              <span className="skel-block skel-pulse w-14 h-3.5 inline-block"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Skeleton Inspection Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Manifest Header Box Skeleton */}
        <div className="bg-paper border border-line p-4 rounded-[2px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-canvas border border-line px-3 py-1 rounded-[2px]">
              <span className="tag-hole"></span>
              <span className="skel-block skel-pulse w-20 h-4 inline-block"></span>
            </div>
            <span className="text-line">|</span>
            <span className="skel-block skel-pulse w-28 h-4 inline-block"></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="skel-block skel-pulse w-24 h-4 inline-block"></span>
            <span className="skel-block skel-pulse w-32 h-4 inline-block"></span>
          </div>
        </div>

        {/* 2-Column Inspection Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-paper border border-line p-2 rounded-[2px]">
              <div className="aspect-[4/3] w-full bg-canvas skel-pulse rounded-[2px] flex items-center justify-center border border-line">
                <div className="flex flex-col items-center gap-2 text-ink/40">
                  <span className="material-symbols-outlined text-4xl animate-pulse">image</span>
                  <span className="font-label-sm text-xs">Authenticating high-resolution fiber plate...</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="skel-block skel-pulse w-48 h-3.5 inline-block"></span>
                <span className="skel-block skel-pulse w-24 h-3.5 inline-block"></span>
              </div>
            </div>

            <div className="bg-paper border border-line p-6 rounded-[2px]">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-line">
                <span className="tag-hole"></span>
                <span className="skel-block skel-pulse w-64 h-5 inline-block"></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="flex flex-col gap-1 pb-2 border-b border-line/50">
                    <span className="skel-block skel-pulse w-24 h-3 inline-block"></span>
                    <span className="skel-block skel-pulse w-40 h-4 inline-block"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-paper border border-line p-6 rounded-[2px] flex flex-col gap-4">
              <span className="skel-block skel-pulse w-32 h-3.5 inline-block"></span>
              <span className="skel-block skel-pulse w-3/4 h-8 inline-block"></span>
              <span className="skel-block skel-pulse w-28 h-6 inline-block"></span>

              <div className="p-4 bg-canvas border-l-4 border-line rounded flex flex-col gap-2">
                <span className="skel-block skel-pulse w-full h-3 inline-block"></span>
                <span className="skel-block skel-pulse w-5/6 h-3 inline-block"></span>
                <span className="skel-block skel-pulse w-2/3 h-3 inline-block"></span>
              </div>

              <div className="pt-4 border-t border-line flex flex-col gap-3">
                <span className="skel-block skel-pulse w-40 h-4 inline-block"></span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-canvas border border-line rounded skel-pulse"></div>
                  <div className="h-14 bg-canvas border border-line rounded skel-pulse"></div>
                </div>
                <div className="h-10 bg-denim/40 rounded skel-pulse mt-2"></div>
              </div>
            </div>

            <div className="p-4 bg-paper border border-line border-l-4 border-l-moss rounded-[2px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="tag-hole"></span>
                <span className="text-xs text-ink font-semibold">Ready to view live directory?</span>
              </div>
              <Link to="/landing" className="text-xs font-semibold text-denim underline">
                Browse catalog →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}