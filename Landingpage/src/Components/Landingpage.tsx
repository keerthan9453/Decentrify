import React, { useEffect, useRef, useState } from "react";

interface LandingPageProps {
    onNavigate: (view: "landing" | "auth" | "dashboard") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Leaderboard (sample data)
    const leaderboard = [
        { rank: 1, name: "Ayaan", score: 9842, delta: "+4.1%", status: "LIVE" },
        { rank: 2, name: "Hamza", score: 9630, delta: "+2.7%", status: "LIVE" },
        { rank: 3, name: "Justin", score: 9412, delta: "+1.9%", status: "SYNC" },
        { rank: 4, name: "Keerthan", score: 9150, delta: "+1.1%", status: "SYNC" },
        { rank: 5, name: "Idrak", score: 8893, delta: "+0.6%", status: "IDLE" },
    ];

    const statusStyle = (s: string) => {
        if (s === "LIVE")
            return {
                color: "rgba(255, 136, 0, 0.95)",
                border: "1px solid rgba(255, 85, 0, 0.35)",
                background: "rgba(0,0,0,0.35)",
            } as React.CSSProperties;

        if (s === "SYNC")
            return {
                color: "rgba(255, 255, 255, 0.75)",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.25)",
            } as React.CSSProperties;

        return {
            color: "rgba(156, 163, 175, 0.9)",
            border: "1px solid rgba(156,163,175,0.2)",
            background: "rgba(0,0,0,0.2)",
        } as React.CSSProperties;
    };

    useEffect(() => {
        // Simple fade-in animation on mount
        if (heroRef.current) {
            heroRef.current.style.opacity = "0";
            setTimeout(() => {
                if (heroRef.current) {
                    heroRef.current.style.transition = "opacity 0.8s ease-out";
                    heroRef.current.style.opacity = "1";
                }
            }, 100);
        }

        // Mouse move handler for glow effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="page-root">
            {/* Mouse Glow Effect */}
            <div
                style={{
                    position: "fixed",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(255, 85, 0, 0.15), transparent 70%)",
                    pointerEvents: "none",
                    transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250
                        }px)`,
                    transition: "transform 0.2s ease-out",
                    zIndex: 1,
                    filter: "blur(40px)",
                }}
            />

            {/* Navigation Bar */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 50,
                    background: "rgba(15, 15, 15, 0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "0 16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: "80px",
                        }}
                    >
                        {/* Logo */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        fontSize: "30px",
                                        color: "var(--primary)",
                                        position: "relative",
                                        zIndex: 10,
                                    }}
                                >
                                    ⚡
                                </span>
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "var(--primary)",
                                        filter: "blur(12px)",
                                        opacity: 0.5,
                                    }}
                                ></div>
                            </div>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    color: "white",
                                }}
                            >
                                Decentrify
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "32px",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            <a
                                href="#"
                                style={{
                                    color: "#9ca3af",
                                    textDecoration: "none",
                                    transition: "color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                            >
                                Manifesto
                            </a>
                            <a
                                href="#"
                                style={{
                                    color: "#9ca3af",
                                    textDecoration: "none",
                                    transition: "color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                            >
                                Technology
                            </a>
                            <button
                                onClick={() => onNavigate("auth")}
                                style={{
                                    color: "#9ca3af",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    transition: "color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                            >
                                Log In
                            </button>
                            <a
                                href="#"
                                style={{
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    color: "white",
                                    padding: "8px 20px",
                                    borderRadius: "9999px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    textDecoration: "none",
                                    transition: "all 0.3s",
                                    background: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "rgba(255, 255, 255, 0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                Specs
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Background Effects */}
            <div className="grid-pattern-overlay"></div>
            <div className="ambient-glow-top"></div>
            <div className="ambient-glow-bottom"></div>
            <div className="scanline"></div>

            {/* Main Landing Section */}
            <section className="landing" ref={heroRef}>
                <div
                    className="tech-grid-overlay"
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                ></div>

                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        maxWidth: "1280px",
                        margin: "0 auto",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* Hero Title */}
                    <h1 className="hero-title" style={{ textAlign: "center" }}>
                        A New Era of
                        <br />
                        <span
                            className="orange-gradient-text text-glow-orange"
                            style={{ filter: "drop-shadow(0 0 20px rgba(255, 85, 0, 0.3))" }}
                        >
                            Model Training
                        </span>
                    </h1>

                    {/* Hero Subtitle */}
                    <p className="hero-subtitle" style={{ textAlign: "center" }}>
                        The world's most advanced distributed ML clinic. Train faster, scale
                        infinitely, and turn everyday devices into real AI infrastructure.
                    </p>

                    {/* CTA Button */}
                    <div
                        style={{ marginBottom: "64px", position: "relative", zIndex: 20 }}
                    >
                        <button
                            className="cta-btn cta-primary"
                            onClick={() => onNavigate("auth")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                justifyContent: "center",
                                fontSize: "16px",
                                padding: "18px 48px",
                            }}
                        >
                            Let's Begin
                            <span style={{ fontSize: "16px" }}>→</span>
                        </button>
                    </div>

                    {/* Leaderboard (replaces hero images) */}
                    <div className="hero-image-container">
                        {/* Glow Layers (kept same style as your original hero image section) */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "120%",
                                height: "120%",
                                background:
                                    "radial-gradient(circle, rgba(255, 85, 0, 0.3), transparent)",
                                filter: "blur(80px)",
                                zIndex: -1,
                            }}
                        ></div>
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                height: "80%",
                                background: "rgba(255, 85, 0, 0.2)",
                                filter: "blur(100px)",
                                animation: "pulse-slow 4s ease-in-out infinite",
                                zIndex: -1,
                            }}
                        ></div>

                        <div className="hero-image-wrapper">
                            <div className="hero-image-aspect">
                                <div
                                    style={{
                                        borderRadius: "24px",
                                        overflow: "hidden",
                                        border: "1px solid rgba(255, 255, 255, 0.10)",
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                                        boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
                                        backdropFilter: "blur(14px)",
                                        WebkitBackdropFilter: "blur(14px)",
                                        width: "min(920px, 92vw)",
                                        margin: "0 auto",
                                    }}
                                >
                                    {/* Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "18px 20px",
                                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 4,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: "JetBrains Mono, monospace",
                                                    fontSize: 12,
                                                    letterSpacing: "0.18em",
                                                    textTransform: "uppercase",
                                                    color: "rgba(255, 136, 0, 0.85)",
                                                }}
                                            >
                                                Global Leaderboard
                                            </span>
                                            <span
                                                style={{
                                                    color: "rgba(255,255,255,0.85)",
                                                    fontWeight: 700,
                                                    fontSize: 16,
                                                }}
                                            >
                                                Training Efficiency Index
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                fontFamily: "JetBrains Mono, monospace",
                                                fontSize: 12,
                                                color: "rgba(255, 136, 0, 0.85)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    padding: "6px 10px",
                                                    borderRadius: 999,
                                                    border: "1px solid rgba(255, 85, 0, 0.35)",
                                                    background: "rgba(0,0,0,0.35)",
                                                }}
                                            >
                                                SYS_READY
                                            </span>
                                            <span style={{ opacity: 0.9 }}>
                                                <span
                                                    style={{ animation: "pulse 2s ease-in-out infinite" }}
                                                >
                                                    ●
                                                </span>{" "}
                                                LIVE FEED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Columns */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "80px 1.4fr 1fr 120px",
                                            gap: 0,
                                            padding: "12px 20px",
                                            fontFamily: "JetBrains Mono, monospace",
                                            fontSize: 12,
                                            color: "rgba(156, 163, 175, 0.95)",
                                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        <div>RANK</div>
                                        <div>NODE</div>
                                        <div>SCORE</div>
                                        <div style={{ textAlign: "right" }}>STATUS</div>
                                    </div>

                                    {/* Rows */}
                                    <div style={{ padding: "6px 8px 12px" }}>
                                        {leaderboard.map((row) => (
                                            <div
                                                key={row.rank}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "80px 1.4fr 1fr 120px",
                                                    alignItems: "center",
                                                    padding: "12px 12px",
                                                    margin: "6px 12px",
                                                    borderRadius: 16,
                                                    border:
                                                        row.rank === 1
                                                            ? "1px solid rgba(255, 85, 0, 0.35)"
                                                            : "1px solid rgba(255,255,255,0.08)",
                                                    background:
                                                        row.rank === 1
                                                            ? "linear-gradient(90deg, rgba(255,85,0,0.10), rgba(255,255,255,0.02))"
                                                            : "rgba(0,0,0,0.18)",
                                                    transition:
                                                        "transform 0.2s ease, border-color 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0px)";
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 800,
                                                        color:
                                                            row.rank === 1
                                                                ? "rgba(255, 136, 0, 0.95)"
                                                                : "rgba(255,255,255,0.75)",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    #{row.rank}
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "rgba(255,255,255,0.9)",
                                                            fontWeight: 700,
                                                            fontFamily: "Inter, system-ui",
                                                        }}
                                                    >
                                                        {row.name}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "rgba(156, 163, 175, 0.9)",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        Δ {row.delta} · last 5m
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "white",
                                                            fontWeight: 800,
                                                            fontSize: 14,
                                                            fontFamily: "Inter, system-ui",
                                                        }}
                                                    >
                                                        {row.score.toLocaleString()}
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: "rgba(156,163,175,0.9)",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        opt. score
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "flex-end",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            ...statusStyle(row.status),
                                                            padding: "6px 10px",
                                                            borderRadius: 999,
                                                            fontSize: 12,
                                                            fontFamily: "JetBrains Mono, monospace",
                                                        }}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer mini-metric */}
                                    <div
                                        style={{
                                            padding: "14px 20px 18px",
                                            borderTop: "1px solid rgba(255,255,255,0.06)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            color: "rgba(156, 163, 175, 0.95)",
                                        }}
                                    >
                                        <span style={{ fontSize: 13 }}>
                                            Showing top 5 · updated in real-time
                                        </span>

                                        <div
                                            style={{ display: "flex", alignItems: "center", gap: 14 }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: "JetBrains Mono, monospace",
                                                    fontSize: 12,
                                                }}
                                            >
                                                Throughput:{" "}
                                                <span style={{ color: "rgba(255, 136, 0, 0.95)" }}>
                                                    14.2k
                                                </span>
                                                /s
                                            </span>
                                            <button
                                                className="cta-btn cta-secondary"
                                                onClick={() => onNavigate("auth")}
                                                style={{ padding: "10px 16px" }}
                                            >
                                                Connect Node
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Keep the overlay div so your layout/class styling stays consistent */}
                                <div className="hero-image-overlay"></div>
                            </div>
                        </div>
                    </div>

                    {/* Trusted Companies */}
                    <div className="trusted-companies">
                        <div className="company-logos">
                            <div className="company-logo-placeholder"></div>
                            <div className="company-logo-placeholder"></div>
                            <div className="company-logo-placeholder"></div>
                            <div className="company-logo-placeholder"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">10x</div>
                        <div className="stat-label">Training Speed</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">Zero</div>
                        <div className="stat-label">Infra Overhead</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">99.9%</div>
                        <div className="stat-label">Uptime SLA</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">Local</div>
                        <div className="stat-label">Privacy First</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                style={{
                    padding: "96px 20px",
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--background-dark)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "25%",
                        width: "500px",
                        height: "500px",
                        background: "rgba(255, 85, 0, 0.05)",
                        borderRadius: "50%",
                        filter: "blur(120px)",
                        pointerEvents: "none",
                    }}
                ></div>

                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    {/* Section Header */}
                    <div
                        style={{
                            marginBottom: "80px",
                            textAlign: "center",
                            maxWidth: "768px",
                            margin: "0 auto 80px",
                        }}
                    >
                        <span
                            style={{
                                color: "var(--primary)",
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: "12px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                marginBottom: "16px",
                                display: "block",
                            }}
                        >
                            System Architecture
                        </span>
                        <h2
                            style={{
                                fontSize: "clamp(32px, 5vw, 48px)",
                                fontWeight: 700,
                                color: "white",
                                marginBottom: "24px",
                                lineHeight: 1.2,
                            }}
                        >
                            Designed for the{" "}
                            <span
                                style={{
                                    fontStyle: "italic",
                                    background:
                                        "linear-gradient(to right, var(--primary), var(--primary-light))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Post-Cloud
                            </span>{" "}
                            Era.
                        </h2>
                        <p
                            style={{
                                color: "#9ca3af",
                                fontSize: "18px",
                                fontWeight: 300,
                            }}
                        >
                            Decentrify moves the heavy lifting to the edge. Our distributed
                            kernel manages resources dynamically, ensuring your models train
                            efficiently without the massive cloud bill.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="features">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Lightning Fast</h3>
                            <p className="feature-desc">
                                Distribute training across multiple peers for faster convergence
                                and real-time optimization.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure & Private</h3>
                            <p className="feature-desc">
                                Your data stays encrypted with enterprise-grade security.
                                End-to-end encryption enabled by default.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Real-time Analytics</h3>
                            <p className="feature-desc">
                                Monitor training progress and results in real-time with granular
                                telemetry and visual compute graphs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section
                style={{
                    padding: "80px 20px",
                    position: "relative",
                    background: "rgba(10, 10, 10, 0.5)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    <h2
                        style={{
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 700,
                            color: "white",
                            marginBottom: "16px",
                            lineHeight: 1.2,
                        }}
                    >
                        Ready to scale?
                    </h2>
                    <p
                        style={{
                            color: "#9ca3af",
                            fontSize: "18px",
                            maxWidth: "600px",
                            marginBottom: "40px",
                            fontWeight: 300,
                        }}
                    >
                        Join thousands of engineers building the future on Decentrify. The
                        waitlist is moving fast.
                    </p>

                    <div className="cta-group">
                        <button
                            className="cta-btn cta-primary"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                justifyContent: "center",
                            }}
                        >
                            Join Waitlist
                            <span style={{ fontSize: "14px" }}>→</span>
                        </button>
                        <button className="cta-btn cta-secondary">Read Manifesto</button>
                    </div>
                </div>

                {/* Decorative Glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "600px",
                        height: "600px",
                        background:
                            "radial-gradient(circle, rgba(255, 85, 0, 0.1), transparent 70%)",
                        filter: "blur(80px)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                ></div>
            </section>

            {/* Footer Glow */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "256px",
                    background:
                        "linear-gradient(to top, rgba(255, 85, 0, 0.1), transparent)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            ></div>
        </div>
    );
};
