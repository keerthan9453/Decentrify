// TrainerCard.tsx - Trainer/Coordinator view card with heartbeat and hyperparameters

import React from 'react';
import type { PeerData } from './types';

interface TrainerCardProps {
    peerId: string;
    peer: PeerData;
    index: number;
    color: string;
    status: string;
}

export const TrainerCard: React.FC<TrainerCardProps> = ({
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

    // Calculate metrics
    const avgLoss = hasData
        ? peer.epochs.reduce((sum, e) => sum + e.loss, 0) / peer.epochs.length
        : 0;
    const avgAccuracy = hasData
        ? peer.epochs.reduce((sum, e) => sum + e.accuracy, 0) / peer.epochs.length
        : 0;
    const improvement = hasData && peer.epochs.length > 1
        ? ((peer.epochs[peer.epochs.length - 1].accuracy - peer.epochs[0].accuracy) * 100)
        : 0;

    // Truncate peer ID for display
    const displayId = peerId.length > 20
        ? `${peerId.substring(0, 8)}...${peerId.substring(peerId.length - 8)}`
        : peerId;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(25, 25, 25, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
            }}
        >
            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
                opacity: isTraining ? 1 : 0.3
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                    }}>
                        {/* Heartbeat Icon */}
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: isSyncing
                                ? '#eab308'
                                : isTraining
                                    ? '#22c55e'
                                    : '#6b7280',
                            boxShadow: (isSyncing || isTraining)
                                ? `0 0 8px ${isSyncing ? '#eab308' : '#22c55e'}`
                                : 'none',
                            animation: (isSyncing || isTraining) ? 'heartbeat 1.5s ease-in-out infinite' : 'none'
                        }} />
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#fff',
                            margin: 0
                        }}>
                            Peer {index + 1}
                        </h3>
                    </div>
                    <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                    }}>
                        {displayId}
                    </div>
                </div>
                <div>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
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
                        {isSyncing ? 'Syncing' : isTraining ? 'Training' : 'Completed'}
                    </span>
                </div>
            </div>

            {/* Primary Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'rgba(255, 136, 0, 0.05)',
                    border: '1px solid rgba(255, 136, 0, 0.15)',
                    borderRadius: '8px',
                    padding: '1rem'
                }}>
                    <div style={{
                        fontSize: '10px',
                        color: '#FF8800',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.5rem',
                        fontWeight: '600'
                    }}>
                        Current Loss
                    </div>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        fontFamily: 'monospace'
                    }}>
                        {latestEpoch ? latestEpoch.loss.toFixed(4) : '—'}
                    </div>
                    {hasData && (
                        <div style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            marginTop: '0.25rem'
                        }}>
                            Avg: {avgLoss.toFixed(4)}
                        </div>
                    )}
                </div>

                <div style={{
                    background: 'rgba(0, 255, 157, 0.05)',
                    border: '1px solid rgba(0, 255, 157, 0.15)',
                    borderRadius: '8px',
                    padding: '1rem'
                }}>
                    <div style={{
                        fontSize: '10px',
                        color: '#00FF9D',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.5rem',
                        fontWeight: '600'
                    }}>
                        Current Accuracy
                    </div>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        fontFamily: 'monospace'
                    }}>
                        {latestEpoch ? `${(latestEpoch.accuracy * 100).toFixed(1)}%` : '—'}
                    </div>
                    {hasData && (
                        <div style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            marginTop: '0.25rem'
                        }}>
                            Avg: {(avgAccuracy * 100).toFixed(1)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Training Progress */}
            {hasData && !isSyncing && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                    }}>
                        <span style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            fontFamily: 'monospace',
                            fontWeight: '600'
                        }}>
                            Training Progress
                        </span>
                        <span style={{
                            fontSize: '11px',
                            color: '#fff',
                            fontFamily: 'monospace'
                        }}>
                            {latestEpoch ? latestEpoch.epoch : 0}/{peer.hyperparameters?.epochs || 10}
                        </span>
                    </div>
                    <div style={{
                        height: '6px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(249, 115, 22, 0.2)',
                            animation: isTraining ? 'pulse 2s ease-in-out infinite' : 'none'
                        }} />
                        <div style={{
                            height: '100%',
                            background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                            borderRadius: '3px',
                            width: `${latestEpoch ? (latestEpoch.epoch / (peer.hyperparameters?.epochs || 10)) * 100 : 0}%`,
                            boxShadow: `0 0 10px ${color}`,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
            )}

            {/* Syncing State */}
            {isSyncing && (
                <div style={{
                    background: 'rgba(234, 179, 8, 0.05)',
                    border: '1px solid rgba(234, 179, 8, 0.15)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '2rem',
                        color: '#eab308',
                        marginBottom: '0.5rem',
                        animation: 'spin 2s linear infinite'
                    }}>
                        ⟳
                    </div>
                    <div style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontFamily: 'monospace'
                    }}>
                        Waiting for gradient update...
                    </div>
                </div>
            )}

            {/* Hyperparameters Grid - Epochs, Batch Size, Learning Rate */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1rem'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.25rem'
                    }}>
                        Epochs
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#fff'
                    }}>
                        {peer.hyperparameters?.epochs || '—'}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.25rem'
                    }}>
                        Batch Size
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#fff'
                    }}>
                        {peer.hyperparameters?.batch_size || '—'}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '9px',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                        marginBottom: '0.25rem'
                    }}>
                        LR
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#fff'
                    }}>
                        {peer.hyperparameters?.lr || peer.hyperparameters?.learning_rate || '—'}
                    </div>
                </div>
            </div>

            {/* Performance Indicator */}
            {hasData && improvement !== 0 && (
                <div style={{
                    padding: '0.75rem',
                    background: improvement > 0
                        ? 'rgba(34, 197, 94, 0.05)'
                        : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${improvement > 0
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        fontSize: '14px',
                        color: improvement > 0 ? '#22c55e' : '#ef4444'
                    }}>
                        {improvement > 0 ? '↗' : '↘'}
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: improvement > 0 ? '#22c55e' : '#ef4444',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                    }}>
                        {Math.abs(improvement).toFixed(2)}% {improvement > 0 ? 'improvement' : 'decline'}
                    </span>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes heartbeat {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                    14% { 
                        transform: scale(1.3);
                        opacity: 0.8;
                    }
                    28% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                    42% { 
                        transform: scale(1.3);
                        opacity: 0.8;
                    }
                    56% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};