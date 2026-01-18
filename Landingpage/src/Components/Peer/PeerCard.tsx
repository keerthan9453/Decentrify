// PeerCard.tsx - Peer node card matching the HTML design
import React from 'react';
import type { PeerData } from '../types';

interface PeerCardProps {
    peerId: string;
    peer: PeerData;
    index: number;
    color: string;
    status: string;
}

export const PeerCard: React.FC<PeerCardProps> = ({
    peerId,
    peer,
    index,
    color,
    status
}) => {
    const isTraining = status === 'RUNNING';
    const isSyncing = peer.epochs.length === 0 && isTraining;
    const latestEpoch = peer.epochs[peer.epochs.length - 1];
    const hasData = peer.epochs.length > 0;

    // Generate SVG path data for loss and accuracy curves
    const generatePath = (dataKey: 'loss' | 'accuracy') => {
        if (!hasData) return '';

        const width = 400;
        const height = 200;
        const points = peer.epochs.map((epoch, idx) => {
            const x = (idx / Math.max(peer.epochs.length - 1, 1)) * width;
            const value = dataKey === 'loss' ? epoch.loss : epoch.accuracy;
            const y = dataKey === 'loss'
                ? height - (value / 1) * height * 0.8
                : height - (value * height * 0.8);
            return { x, y };
        });

        if (points.length === 0) return '';

        // Create smooth curve using quadratic bezier
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i - 1];
            const currPoint = points[i];
            const midX = (prevPoint.x + currPoint.x) / 2;
            path += ` Q${prevPoint.x},${currPoint.y} ${midX},${currPoint.y}`;
            if (i < points.length - 1) {
                const nextPoint = points[i + 1];
                const nextMidX = (currPoint.x + nextPoint.x) / 2;
                path += ` T${nextMidX},${nextPoint.y}`;
            } else {
                path += ` T${currPoint.x},${currPoint.y}`;
            }
        }

        return path;
    };

    const lossPath = generatePath('loss');
    const accPath = generatePath('accuracy');

    // Truncate peer ID for display
    const displayId = peerId.length > 16
        ? `${peerId.substring(0, 5)}...${peerId.substring(peerId.length - 6)}`
        : peerId;

    return (
        <div className="monitor-card" style={{
            background: 'rgba(18, 18, 18, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            transition: 'all 0.3s ease',
            opacity: isSyncing ? 0.8 : 1
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        position: 'relative',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            color: isTraining && !isSyncing ? '#f97316' : '#6b7280',
                            animation: isTraining && !isSyncing ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                        }}>♥</span>
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            color: '#fff',
                            margin: 0
                        }}>
                            Peer {index + 1}
                        </h3>
                        <p style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            fontFamily: 'monospace',
                            margin: 0
                        }}>
                            UID: {displayId}
                        </p>
                    </div>
                </div>
                <div>
                    <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: isSyncing
                            ? 'rgba(234, 179, 8, 0.1)'
                            : isTraining
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(107, 114, 128, 0.1)',
                        color: isSyncing
                            ? '#eab308'
                            : isTraining
                                ? '#22c55e'
                                : '#6b7280',
                        border: `1px solid ${isSyncing
                            ? 'rgba(234, 179, 8, 0.2)'
                            : isTraining
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)'}`
                    }}>
                        {isSyncing ? 'Syncing' : isTraining ? 'Training' : 'Idle'}
                    </span>
                </div>
            </div>

            {/* Graph Area */}
            <div style={{
                position: 'relative',
                height: '240px',
                width: '100%',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                marginBottom: '1rem'
            }}>
                {isSyncing ? (
                    // Syncing State
                    <>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.2
                        }}>
                            <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 400 200">
                                <path
                                    d="M0,60 Q60,120 120,140 T240,160 T360,170 T400,175"
                                    fill="none"
                                    stroke="#FF8800"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M0,160 Q60,100 120,60 T240,40 T360,30 T400,28"
                                    fill="none"
                                    stroke="#00FF9D"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                fontSize: '2rem',
                                color: '#eab308',
                                animation: 'spin 12s linear infinite'
                            }}>⟳</span>
                            <span style={{
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                color: '#9ca3af'
                            }}>
                                Waiting for gradient update...
                            </span>
                        </div>
                    </>
                ) : (
                    // Training/Complete State with Graph
                    <>
                        <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            left: '1rem',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#FF8800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            <span style={{ width: '0.5rem', height: '2px', background: '#FF8800' }} />
                            Loss
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '1rem',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#00FF9D',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            Accuracy
                            <span style={{ width: '0.5rem', height: '2px', background: '#00FF9D' }} />
                        </div>

                        <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 400 200">
                            {/* Grid lines */}
                            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" />
                            <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" />

                            {/* Loss line */}
                            {hasData && (
                                <>
                                    <path
                                        d={lossPath}
                                        fill="none"
                                        stroke="#FF8800"
                                        strokeWidth="2"
                                        style={{
                                            strokeDasharray: 1000,
                                            strokeDashoffset: 0,
                                            animation: 'drawLine 3s ease-out forwards'
                                        }}
                                    />
                                    {/* Loss gradient fill */}
                                    <defs>
                                        <linearGradient id="gradLoss" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#FF8800" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#FF8800" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={`${lossPath} V200 H0 Z`}
                                        fill="url(#gradLoss)"
                                        opacity="0.1"
                                    />
                                </>
                            )}

                            {/* Accuracy line */}
                            {hasData && (
                                <path
                                    d={accPath}
                                    fill="none"
                                    stroke="#00FF9D"
                                    strokeWidth="2"
                                    style={{
                                        strokeDasharray: 1000,
                                        strokeDashoffset: 0,
                                        animation: 'drawLine 3s ease-out forwards 0.5s'
                                    }}
                                />
                            )}

                            {/* Current point indicator */}
                            {latestEpoch && (
                                <>
                                    <circle
                                        cx={(peer.epochs.length - 1) / Math.max(peer.epochs.length - 1, 1) * 400}
                                        cy={200 - (latestEpoch.loss / 1) * 200 * 0.8}
                                        r="3"
                                        fill="#000"
                                        stroke="#FF8800"
                                        strokeWidth="1.5"
                                    />
                                    {/* Tooltip */}
                                    <g transform={`translate(${Math.max(100, Math.min(300, (peer.epochs.length - 1) / Math.max(peer.epochs.length - 1, 1) * 400 - 40))}, 130)`}>
                                        <rect
                                            x="0"
                                            y="0"
                                            width="80"
                                            height="35"
                                            rx="4"
                                            fill="rgba(20,20,20,0.9)"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <text
                                            x="40"
                                            y="14"
                                            textAnchor="middle"
                                            fill="#fff"
                                            fontSize="8"
                                            fontFamily="monospace"
                                        >
                                            Epoch {latestEpoch.epoch}
                                        </text>
                                        <text
                                            x="40"
                                            y="26"
                                            textAnchor="middle"
                                            fill="#FF8800"
                                            fontSize="9"
                                            fontFamily="monospace"
                                            fontWeight="bold"
                                        >
                                            {latestEpoch.loss.toFixed(4)}
                                        </text>
                                    </g>
                                </>
                            )}
                        </svg>

                        <div style={{
                            position: 'absolute',
                            bottom: '0.25rem',
                            left: '0.25rem',
                            fontSize: '8px',
                            fontFamily: 'monospace',
                            color: '#6b7280'
                        }}>0</div>
                        <div style={{
                            position: 'absolute',
                            bottom: '0.25rem',
                            right: '0.25rem',
                            fontSize: '8px',
                            fontFamily: 'monospace',
                            color: '#6b7280'
                        }}>{peer.hyperparameters?.epochs || 10}</div>
                    </>
                )}
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
                opacity: isSyncing ? 0.5 : 1
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <span style={{
                        display: 'block',
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.125rem'
                    }}>Loss</span>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#fff'
                    }}>
                        {latestEpoch ? latestEpoch.loss.toFixed(4) : '—'}
                    </span>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <span style={{
                        display: 'block',
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.125rem'
                    }}>Accuracy</span>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#00FF9D'
                    }}>
                        {latestEpoch ? `${(latestEpoch.accuracy * 100).toFixed(1)}%` : '—'}
                    </span>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <span style={{
                        display: 'block',
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.125rem'
                    }}>Step</span>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#d1d5db'
                    }}>
                        {latestEpoch ? latestEpoch.epoch * (peer.hyperparameters?.batch_size || 32) : '—'}
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes drawLine {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};