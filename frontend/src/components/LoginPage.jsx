import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function LoginPage({ mode = "login" }) {
  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotToken, setForgotToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsSignUp(location.pathname === "/signup" || mode === "signup");
    setError("");
    setMessage("");
  }, [location.pathname, mode]);

  const handleToggleMode = () => {
    setError("");
    setMessage("");
    if (isSignUp) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (isSignUp ? "Registration failed" : "Sign in failed"));
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Redirect back to where user was trying to go, or default to dashboard
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to dispatch reset instructions");
      setForgotSent(true);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${forgotToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      setForgotSuccess(true);
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-canvas selection:bg-denim selection:text-paper font-sans">
      <Navbar minimal />

      {/* Main Dual-Panel Auth Surface */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-4xl bg-paper border border-line rounded-[2px] relative overflow-hidden shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
            {/* Left Decorative/Mission Panel */}
            <div className="md:col-span-5 bg-denim text-paper p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-line">
              {/* Background texture simulation */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida/AEtjO1URtdUGehG9soHZduXIqe9Xk5aXPXDFk7SAS1OGuxxuZX8g-oL-xL7E6yoxqdldlsHBSz-ERuLu9tpceCXZr_puTny48u9riWW1Vp_UJ70A_WjtFnwsaA0cPbtAdOSsL88II-ZOE1VtKs93S-LmbgXs_VW4HFBBzSF1nX-WAKVMT-HDRIDtyHvxSTtdUVoIBnAfn1sHj71PFS5q306EWHkjanR69BqhbuTC_B4nxFudDCLjseZuQG_a5b8')",
                }}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="tag-hole border-paper/40"></span>
                  <span className="font-label-sm text-[11px] uppercase tracking-widest text-paper/80 font-medium">
                    Consignment Ledger Node
                  </span>
                </div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-paper tracking-tight leading-snug">
                  {isSignUp ? "Join the community textile rotation." : "Welcome back to the garment registry."}
                </h2>
                <p className="font-body-sm text-sm text-paper/80 mt-3 leading-relaxed">
                  Every garment logged is assigned a unique tag ID, verified for natural fiber integrity, and cleared
                  through local depot exchanges.
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-paper/20 mt-6">
                <div className="flex items-center justify-between text-xs text-paper/70 font-label-md">
                  <span>Active Exchange Registry</span>
                  <span className="text-secondary-fixed">Cascaidia Hub #44-A</span>
                </div>
                <p className="text-[11px] text-paper/60 mt-1 font-body-sm">
                  100% verified textiles • Zero fast fashion
                </p>

                <div className="mt-6 pt-4 border-t border-paper/20">
                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className="text-xs text-paper hover:text-white font-medium underline underline-offset-4 flex items-center gap-1.5"
                  >
                    <span>{isSignUp ? "Already a registered member? Sign in" : "Need an exchange ledger card? Register"}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Panel */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-paper">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-ink tracking-tight">
                      {isSignUp ? "Create Member Record" : "Sign In to Registry"}
                    </h3>
                    <p className="font-body-sm text-xs text-ink/60 mt-0.5">
                      {isSignUp
                        ? "Register with your verified community credentials."
                        : "Enter your member credentials to access your closet."}
                    </p>
                  </div>
                  <span className="tag-hole"></span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error-container/40 border-l-4 border-error text-error text-xs font-body-sm rounded-[2px]">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="mb-4 p-3 bg-secondary-container/40 border-l-4 border-secondary text-secondary text-xs font-body-sm rounded-[2px]">
                    {message}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                  {isSignUp && (
                    <div className="flex flex-col gap-1">
                      <label className="font-label-md text-xs font-medium text-ink uppercase tracking-wider">
                        Full Name / Handle
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-md text-sm placeholder:text-ink/40 focus:outline-none focus:border-b-2 focus:border-denim transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="font-label-md text-xs font-medium text-ink uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="member@community.org"
                      className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-md text-sm placeholder:text-ink/40 focus:outline-none focus:border-b-2 focus:border-denim transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-xs font-medium text-ink uppercase tracking-wider">
                        Password
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-xs text-denim hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-md text-sm placeholder:text-ink/40 focus:outline-none focus:border-b-2 focus:border-denim transition-colors"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-ink text-paper font-label-lg text-sm rounded-[2px] hover:bg-denim transition-colors flex items-center justify-center gap-2"
                    >
                      {loading && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                      <span>{isSignUp ? "Register Member Record" : "Sign In to Closet"}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="pt-6 border-t border-line mt-6 flex items-center justify-between text-xs text-ink/60 font-body-sm">
                <span>Cascadia Regional Node</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Registry v18.4
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-paper border-2 border-ink max-w-md w-full p-6 rounded-[2px] relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-ink/60 hover:text-ink material-symbols-outlined"
            >
              close
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="tag-hole"></span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-ink/60">
                Credential Recovery
              </span>
            </div>

            <h3 className="font-serif font-bold text-xl text-ink mb-1">Reset Password</h3>
            <p className="font-body-sm text-xs text-ink/70 mb-4">
              Enter your registered community email to receive a recovery token.
            </p>

            {forgotError && (
              <div className="mb-3 p-2 bg-error-container/40 border-l-2 border-error text-error text-xs">
                {forgotError}
              </div>
            )}

            {!forgotSent ? (
              <form onSubmit={handleSendResetEmail} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-sm text-sm focus:outline-none focus:border-b-2 focus:border-denim"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-2 w-full py-2 bg-ink text-paper text-xs font-label-lg rounded-[2px] hover:bg-denim"
                >
                  {forgotLoading ? "Sending..." : "Dispatch Recovery Email"}
                </button>
              </form>
            ) : !forgotSuccess ? (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                <div className="p-2 bg-secondary-container/30 border-l-2 border-secondary text-secondary text-xs mb-2">
                  Recovery token dispatched! Enter the token from your email below.
                </div>
                <input
                  type="text"
                  required
                  placeholder="Recovery Token"
                  value={forgotToken}
                  onChange={(e) => setForgotToken(e.target.value)}
                  className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-sm text-sm focus:outline-none focus:border-b-2 focus:border-denim"
                />
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-2 bg-transparent border-0 border-b border-line text-ink font-body-sm text-sm focus:outline-none focus:border-b-2 focus:border-denim"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="mt-2 w-full py-2 bg-ink text-paper text-xs font-label-lg rounded-[2px] hover:bg-denim"
                >
                  {forgotLoading ? "Resetting..." : "Confirm New Password"}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-secondary-container text-on-secondary-container text-center rounded-[2px]">
                <p className="font-label-md font-semibold">Password updated successfully!</p>
                <p className="font-body-sm text-xs mt-1">You may now sign in with your new credentials.</p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 px-4 py-1.5 bg-ink text-paper text-xs font-label-md rounded-[2px]"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
