// AnalysisPage.tsx - Dedicated page for AI analysis display

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnalysisPageProps {
    analysis: string;
    sessionId: string;
    onBack: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
    analysis,
    sessionId,
    onBack
}) => {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pageRef.current) {
            gsap.from(pageRef.current, {
                opacity: 50,
                y: 20,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    }, []);

    // Format the analysis text with proper styling
    const formatAnalysis = (text: string) => {
        // Split by lines and format
        const lines = text.split('\n');
        return lines.map((line, index) => {
            // Check if line is a header (starts with ### or **)
            if (line.trim().startsWith('###')) {
                const headerText = line.replace(/###/g, '').trim();
                return (
                    <h3 key={index} style={{
                        color: '#f97316',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        marginTop: index === 0 ? '0' : '2rem',
                        marginBottom: '1rem',
                        borderBottom: '2px solid rgba(249, 115, 22, 0.3)',
                        paddingBottom: '0.5rem'
                    }}>
                        {headerText}
                    </h3>
                );
            }

            // Check if line is a subheader (starts with **)
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <p key={index} style={{
                        marginBottom: '0.75rem',
                        lineHeight: '1.8'
                    }}>
                        {parts.map((part, i) =>
                            i % 2 === 1 ? (
                                <strong key={i} style={{
                                    color: '#8b5cf6',
                                    fontWeight: '600'
                                }}>
                                    {part}
                                </strong>
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )}
                    </p>
                );
            }

            // Bullet points
            if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                const bulletText = line.replace(/^[\*\-]\s*/, '').trim();
                return (
                    <div key={index} style={{
                        display: 'flex',
                        gap: '0.75rem',
                        marginBottom: '0.5rem',
                        paddingLeft: '1rem'
                    }}>
                        <span style={{
                            color: '#06b6d4',
                            marginTop: '0.25rem',
                            flexShrink: 0
                        }}>
                            •
                        </span>
                        <span style={{ lineHeight: '1.8' }}>{bulletText}</span>
                    </div>
                );
            }

            // Regular paragraph
            if (line.trim()) {
                return (
                    <p key={index} style={{
                        marginBottom: '0.75rem',
                        lineHeight: '1.8',
                        color: '#e5e7eb'
                    }}>
                        {line}
                    </p>
                );
            }

            // Empty line for spacing
            return <div key={index} style={{ height: '0.5rem' }} />;
        });
    };

    return (
        <div className="page-root" ref={pageRef} style={{
            minHeight: '100vh',
            padding: '2rem',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="logo">
                        <div className="logo-inner">⚡</div>
                    </div>
                    <div>
                        <h1 className="dash-title" style={{ marginBottom: '0.25rem' }}>
                            AI Training Analysis
                        </h1>
                        <p style={{
                            color: 'var(--muted)',
                            fontSize: '0.875rem',
                            margin: 0
                        }}>
                            Session ID: {sessionId}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(249,115,22,0.1)',
                        border: '1px solid rgba(249,115,22,0.3)',
                        borderRadius: '8px',
                        color: '#f97316',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(249,115,22,0.2)';
                        e.currentTarget.style.transform = 'translateX(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <span>←</span>
                    <span>Back to Results</span>
                </button>
            </div>

            {/* Analysis Content */}
            <div className="card" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
                {/* AI Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '9999px',
                    marginBottom: '2rem'
                }}>
                    <span style={{ fontSize: '1.25rem' }}>🤖</span>
                    <span style={{
                        color: '#8b5cf6',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        AI-Powered Analysis
                    </span>
                </div>

                {/* Formatted Analysis */}
                <div style={{
                    color: '#e5e7eb',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '1rem'
                }}>
                    {formatAnalysis(analysis)}
                </div>

                {/* Footer Info */}
                <div style={{
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--muted)',
                    fontSize: '0.875rem'
                }}>
                    <span style={{
                        color: '#8b5cf6',
                        fontSize: '1rem'
                    }}>
                        ℹ️
                    </span>
                    <span>
                        This analysis was generated by AI based on your training session results.
                        Use it as guidance for improving your hyperparameters and training strategy.
                    </span>
                </div>
            </div>
        </div>
    );
};