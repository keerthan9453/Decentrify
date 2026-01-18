// TimeGraphs.tsx - Training graphs with AI analysis navigation

import React, { useState } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import type { FullResultsResponse, UserRole } from './types';
import { NeuralNetwork } from './Neuralnetwork';
import { PeerCard } from '../Components/Peer/PeerCard';
import { TrainerCard } from './TrainerCard';
import { AnalysisPage } from './TextAnalysis/AnalysisPage';
import { sessionAPI } from './apiService';

interface TrainingGraphsProps {
    resultsData: FullResultsResponse;
    userRole: UserRole | null;
    onBack: () => void;
}

const colors = ['#f97316', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export const TrainingGraphs: React.FC<TrainingGraphsProps> = ({
    resultsData,
    userRole,
    onBack
}) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [showAnalysisPage, setShowAnalysisPage] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const peerEntries = Object.entries(resultsData.peers);
    const hasResults = peerEntries.some(([_, peer]) => peer.epochs.length > 0);
    const isTraining = resultsData.status === 'RUNNING';
    const isPeer = userRole === 'peer';

    // Count online/training peers
    const onlinePeers = peerEntries.filter(([_, peer]) => peer.epochs.length > 0 || isTraining).length;
    const totalPeers = peerEntries.length;

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const result = await sessionAPI.analyzeResults(resultsData.session_id);
            setAnalysis(result.analysis);
            setShowAnalysisPage(true);
        } catch (error: any) {
            setAnalysisError(error.message || 'Failed to analyze results');
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleBackFromAnalysis = () => {
        setShowAnalysisPage(false);
    };

    // Show analysis page if user clicked analyze
    if (showAnalysisPage && analysis) {
        return (
            <AnalysisPage
                analysis={analysis}
                sessionId={resultsData.session_id}
                onBack={handleBackFromAnalysis}
            />
        );
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h2 className="section-title" style={{ margin: 0 }}>Training Progress</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Online Peers Counter */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '8px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22c55e',
                            boxShadow: '0 0 8px #22c55e',
                            animation: isTraining ? 'pulse 2s ease-in-out infinite' : 'none'
                        }} />
                        <span style={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            color: '#22c55e',
                            fontWeight: '700'
                        }}>
                            {onlinePeers}/{totalPeers} Peers Online
                        </span>
                    </div>

                    <button
                        onClick={onBack}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(249,115,22,0.1)',
                            border: '1px solid rgba(249,115,22,0.3)',
                            borderRadius: '8px',
                            color: '#f97316',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(249,115,22,0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
                        }}
                    >
                        ← Back to Sessions
                    </button>
                </div>
            </div>

            {/* Neural Network Animation - Only for Peer users */}
            {isPeer && (
                <div className="card" style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    overflow: 'hidden'
                }}>
                    <NeuralNetwork
                        isTraining={isTraining}
                        height={300}
                        numPeers={peerEntries.length}
                        epochs={peerEntries[0]?.[1]?.hyperparameters?.epochs || 10}
                    />
                </div>
            )}

            {/* Session Info */}
            <div className="card" style={{
                padding: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <div className="session-id">
                            Session ID: {resultsData.session_id}
                        </div>
                        <div className="session-info">
                            <strong>Peers:</strong> {peerEntries.length}
                        </div>
                    </div>
                    <span className={`status-badge ${isTraining
                        ? 'status-training'
                        : resultsData.status === 'COMPLETED'
                            ? 'status-online'
                            : 'status-offline'
                        }`}>
                        {resultsData.status}
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {!hasResults && isTraining && (
                <div className="card" style={{
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--muted)' }}>
                        Training in progress... Waiting for epoch data from peers...
                    </p>
                </div>
            )}

            {/* Training Graphs */}
            {hasResults && (
                <>
                    {/* Loss Graph */}
                    <div className="card" style={{
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{
                            marginBottom: '1rem',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#f97316' }}>📉</span> Loss over Epochs
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    {peerEntries.map(([peerId], idx) => (
                                        <linearGradient
                                            key={`lossGradient-${idx}`}
                                            id={`lossGradient-${idx}`}
                                            x1="0" y1="0" x2="0" y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={colors[idx % colors.length]}
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={colors[idx % colors.length]}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                    dataKey="epoch"
                                    type="number"
                                    domain={[1, 'dataMax']}
                                    allowDecimals={false}
                                    stroke="#9aa0a6"
                                    label={{
                                        value: 'Epoch',
                                        position: 'insideBottom',
                                        offset: -5,
                                        fill: '#9aa0a6'
                                    }}
                                />
                                <YAxis
                                    stroke="#9aa0a6"
                                    label={{
                                        value: 'Loss',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: '#9aa0a6'
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a1a',
                                        border: '1px solid rgba(249,115,22,0.2)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                {peerEntries.map(([peerId, peer], idx) => (
                                    peer.epochs.length > 0 && (
                                        <Area
                                            key={peerId}
                                            data={peer.epochs}
                                            type="monotone"
                                            dataKey="loss"
                                            stroke={colors[idx % colors.length]}
                                            fill={`url(#lossGradient-${idx})`}
                                            name={`Peer ${idx + 1}`}
                                            strokeWidth={2}
                                            connectNulls
                                        />
                                    )
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Accuracy Graph */}
                    <div className="card" style={{
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{
                            marginBottom: '1rem',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#10b981' }}>📈</span> Accuracy over Epochs
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    {peerEntries.map(([peerId], idx) => (
                                        <linearGradient
                                            key={`accGradient-${idx}`}
                                            id={`accGradient-${idx}`}
                                            x1="0" y1="0" x2="0" y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={colors[idx % colors.length]}
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={colors[idx % colors.length]}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                    dataKey="epoch"
                                    type="number"
                                    domain={[1, 'dataMax']}
                                    allowDecimals={false}
                                    stroke="#9aa0a6"
                                    label={{
                                        value: 'Epoch',
                                        position: 'insideBottom',
                                        offset: -5,
                                        fill: '#9aa0a6'
                                    }}
                                />
                                <YAxis
                                    stroke="#9aa0a6"
                                    domain={[0, 1]}
                                    label={{
                                        value: 'Accuracy',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: '#9aa0a6'
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a1a',
                                        border: '1px solid rgba(249,115,22,0.2)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    formatter={(value: number | undefined) =>
                                        typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : 'Accuracy'
                                    }
                                />
                                <Legend />
                                {peerEntries.map(([peerId, peer], idx) => (
                                    peer.epochs.length > 0 && (
                                        <Area
                                            key={peerId}
                                            data={peer.epochs}
                                            type="monotone"
                                            dataKey="accuracy"
                                            stroke={colors[idx % colors.length]}
                                            fill={`url(#accGradient-${idx})`}
                                            name={`Peer ${idx + 1}`}
                                            strokeWidth={2}
                                            connectNulls
                                        />
                                    )
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {/* Peer Details */}
            <div className="section-title" style={{ marginBottom: '1rem' }}>
                Peer Details
            </div>
            <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: peerEntries.length === 1
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(350px, 1fr))',
                maxWidth: peerEntries.length === 1 ? '600px' : '100%',
                marginBottom: '2rem'
            }}>
                {peerEntries.map(([peerId, peer], idx) => (
                    isPeer ? (
                        <PeerCard
                            key={peerId}
                            peerId={peerId}
                            peer={peer}
                            index={idx}
                            color={colors[idx % colors.length]}
                            status={resultsData.status}
                        />
                    ) : (
                        <TrainerCard
                            key={peerId}
                            peerId={peerId}
                            peer={peer}
                            index={idx}
                            color={colors[idx % colors.length]}
                            status={resultsData.status}
                        />
                    )
                ))}
            </div>

            {/* AI Analysis Button */}
            {hasResults && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '3rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        style={{
                            padding: '1rem 2rem',
                            background: isAnalyzing
                                ? 'rgba(139, 92, 246, 0.3)'
                                : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.3s ease',
                            opacity: isAnalyzing ? 0.7 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!isAnalyzing) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="spinner" style={{
                                    width: '20px',
                                    height: '20px',
                                    borderWidth: '2px'
                                }} />
                                <span>Analyzing Results...</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.25rem' }}>🤖</span>
                                <span>Analyze Results with AI</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {analysisError && (
                <div className="card" style={{
                    padding: '1.5rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    marginTop: '1rem',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#ef4444', margin: 0 }}>
                        ⚠️ {analysisError}
                    </p>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};