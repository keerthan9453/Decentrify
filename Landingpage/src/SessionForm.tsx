// SessionForm.tsx - Redesigned with red/dark theme and global params per peer

import React, { useState, useEffect } from 'react';

interface SessionFormProps {
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

interface PeerHyperparams {
    learning_rate: string;
    batch_size: string;
    epochs: string;
    optimizer: string;
    weight_decay: string;
    dropout: string;
    hidden_layers: string;
}

const colors = ['#FF5500', '#60A5FA', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, loading }) => {
    const [numPeers, setNumPeers] = useState(2);
    const [file, setFile] = useState<File | null>(null);
    const [peerParams, setPeerParams] = useState<PeerHyperparams[]>([
        {
            learning_rate: '0.001',
            batch_size: '32',
            epochs: '10',
            optimizer: 'Adam',
            weight_decay: '0.001',
            dropout: '0.3',
            hidden_layers: '128, 64'
        },
        {
            learning_rate: '0.01',
            batch_size: '64',
            epochs: '10',
            optimizer: 'Adam',
            weight_decay: '0.001',
            dropout: '0.3',
            hidden_layers: '128, 64'
        }
    ]);

    useEffect(() => {
        const newParams = Array.from({ length: numPeers }, (_, i) =>
            peerParams[i] || {
                learning_rate: '0.001',
                batch_size: '32',
                epochs: '10',
                optimizer: 'Adam',
                weight_decay: '0.001',
                dropout: '0.3',
                hidden_layers: '128, 64'
            }
        );
        setPeerParams(newParams);
    }, [numPeers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('num_peers', numPeers.toString());
        formData.append('file', file);

        const hyperparameters = peerParams.map(p => ({
            learning_rate: parseFloat(p.learning_rate),
            batch_size: parseInt(p.batch_size),
            epochs: parseInt(p.epochs)
        }));

        formData.append('hyperparameters', JSON.stringify(hyperparameters));
        onSubmit(formData);
    };

    const updatePeerParam = (
        index: number,
        field: keyof PeerHyperparams,
        value: string
    ) => {
        const updated = [...peerParams];
        updated[index][field] = value;
        setPeerParams(updated);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 0'
        }}>
            <form onSubmit={handleSubmit} style={{
                width: '100%',
                maxWidth: '900px'
            }}>
                <div style={{
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(33, 17, 17, 0.7) 0%, rgba(21, 10, 10, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 85, 0, 0.15)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        letterSpacing: '-0.02em'
                    }}>
                        Start Training Session
                    </h2>

                    {/* Number of Peers */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '0.625rem',
                            fontFamily: 'monospace',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '0.5rem'
                        }}>
                            Number of Peers
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="6"
                            value={numPeers}
                            onChange={(e) => setNumPeers(parseInt(e.target.value) || 1)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(0, 0, 0, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '1rem',
                                textAlign: 'center',
                                fontFamily: 'monospace',
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#FF5500';
                                e.target.style.boxShadow = '0 0 10px rgba(255, 85, 0, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Dataset Upload */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            textAlign: 'center',
                            fontSize: '0.625rem',
                            fontFamily: 'monospace',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            marginBottom: '0.5rem'
                        }}>
                            Dataset (CSV)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: '#9ca3af',
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            />
                        </div>
                    </div>

                    {/* Hyperparameters Per Peer */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            textAlign: 'center',
                            fontSize: '0.625rem',
                            fontFamily: 'monospace',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '1.5rem'
                        }}>
                            Hyperparameters per Peer
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {peerParams.map((params, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '1.5rem',
                                        background: i === 0
                                            ? 'linear-gradient(135deg, rgba(255, 85, 0, 0.05) 0%, rgba(255, 85, 0, 0.02) 100%)'
                                            : 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${i === 0 ? 'rgba(255, 85, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                        borderRadius: '12px'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: colors[i % colors.length],
                                            boxShadow: `0 0 8px ${colors[i % colors.length]}`
                                        }} />
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: i === 0 ? '#FF5500' : '#9ca3af',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Peer {i + 1}
                                        </span>
                                    </div>

                                    {/* Training Parameters */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '0.75rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Learning Rate
                                            </label>
                                            <input
                                                type="text"
                                                value={params.learning_rate}
                                                onChange={(e) => updatePeerParam(i, 'learning_rate', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Batch Size
                                            </label>
                                            <input
                                                type="text"
                                                value={params.batch_size}
                                                onChange={(e) => updatePeerParam(i, 'batch_size', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Epochs
                                            </label>
                                            <input
                                                type="text"
                                                value={params.epochs}
                                                onChange={(e) => updatePeerParam(i, 'epochs', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Global Parameters */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '0.75rem'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Optimizer
                                            </label>
                                            <select
                                                value={params.optimizer}
                                                onChange={(e) => updatePeerParam(i, 'optimizer', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Adam">Adam</option>
                                                <option value="SGD">SGD</option>
                                                <option value="RMSprop">RMSprop</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Weight Decay
                                            </label>
                                            <input
                                                type="text"
                                                value={params.weight_decay}
                                                onChange={(e) => updatePeerParam(i, 'weight_decay', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '0.5rem',
                                                fontFamily: 'monospace',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Dropout
                                            </label>
                                            <input
                                                type="text"
                                                value={params.dropout}
                                                onChange={(e) => updatePeerParam(i, 'dropout', e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.375rem 0.5rem',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '6px',
                                                    color: '#fff',
                                                    fontSize: '0.625rem',
                                                    fontFamily: 'monospace'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Hidden Layers */}
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.5rem',
                                            fontFamily: 'monospace',
                                            color: '#6b7280',
                                            textTransform: 'uppercase',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Hidden Layers
                                        </label>
                                        <input
                                            type="text"
                                            value={params.hidden_layers}
                                            onChange={(e) => updatePeerParam(i, 'hidden_layers', e.target.value)}
                                            placeholder="e.g., 128, 64, 32"
                                            style={{
                                                width: '100%',
                                                padding: '0.375rem 0.5rem',
                                                background: 'rgba(0, 0, 0, 0.6)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '0.625rem',
                                                fontFamily: 'monospace'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ paddingTop: '1.5rem' }}>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: loading || !file
                                    ? 'rgba(255, 85, 0, 0.2)'
                                    : 'rgba(255, 85, 0, 0.2)',
                                border: loading || !file
                                    ? '1px solid rgba(255, 85, 0, 0.3)'
                                    : '1px solid rgba(255, 85, 0, 0.4)',
                                borderRadius: '12px',
                                color: loading || !file ? '#FF5500' : '#FF5500',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: loading || !file ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                transition: 'all 0.3s ease',
                                boxShadow: loading || !file
                                    ? 'none'
                                    : '0 0 20px rgba(255, 85, 0, 0.2)',
                                animation: loading || !file ? 'none' : 'pulse-glow 2s ease-in-out infinite'
                            }}
                            onMouseOver={(e) => {
                                if (!loading && file) {
                                    e.currentTarget.style.background = 'rgba(255, 85, 0, 0.3)';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!loading && file) {
                                    e.currentTarget.style.background = 'rgba(255, 85, 0, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                            onMouseDown={(e) => {
                                if (!loading && file) {
                                    e.currentTarget.style.transform = 'scale(0.95)';
                                }
                            }}
                            onMouseUp={(e) => {
                                if (!loading && file) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }
                            }}
                        >
                            {loading ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div className="spinner" />
                                    <span>Starting...</span>
                                </div>
                            ) : (
                                'Start Training'
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { 
                        box-shadow: 0 0 15px rgba(255, 85, 0, 0.4);
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(255, 85, 0, 0.7);
                    }
                }
            `}</style>
        </div>
    );
};