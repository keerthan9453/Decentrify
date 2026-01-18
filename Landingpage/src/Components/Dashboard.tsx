// Dashboard.tsx - Updated with peer console and online peer count

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type {
    DashboardProps,
    Session,
    FullResultsResponse
} from './types';
import { sessionAPI } from './apiService';
import { NeuralNetwork } from './Neuralnetwork';
import { SessionForm } from '../SessionForm';
import { SessionList } from '../SessionList';
import { TrainingGraphs } from './TimeGraphs';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ExtendedDashboardProps extends DashboardProps {
    onPeerJoinNetwork?: () => void;
}

export const Dashboard: React.FC<ExtendedDashboardProps> = ({
    user,
    onLogout,
    userRole,
    onChangeRole,
    onPeerJoinNetwork
}) => {
    const [view, setView] = useState<'create' | 'sessions'>('sessions');
    const [ownedSessions, setOwnedSessions] = useState<Session[]>([]);
    const [joinedSessions, setJoinedSessions] = useState<Session[]>([]);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [onlinePeersCount, setOnlinePeersCount] = useState<number>(0);
    const [uptime, setUptime] = useState(0);

    const [resultsData, setResultsData] = useState<FullResultsResponse | null>(null);
    const [monitoringSessionId, setMonitoringSessionId] = useState<string | null>(null);

    const dashRef = useRef<HTMLDivElement>(null);
    const pollingInterval = useRef<number | null>(null);
    const uptimeInterval = useRef<number | null>(null);

    const isPeer = userRole === 'peer';
    const isTrainer = userRole === 'trainer';

    // Initial animation
    useEffect(() => {
        if (dashRef.current) {
            gsap.from(dashRef.current, {
                opacity: 50,
                y: 20,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    }, []);

    // Uptime counter for peers
    useEffect(() => {
        if (isPeer && isOnline) {
            uptimeInterval.current = window.setInterval(() => {
                setUptime(prev => prev + 1);
            }, 1000);

            return () => {
                if (uptimeInterval.current) {
                    clearInterval(uptimeInterval.current);
                }
            };
        } else {
            setUptime(0);
        }
    }, [isPeer, isOnline]);

    // Fetch online peers count for trainers
    useEffect(() => {
        if (isTrainer) {
            fetchOnlinePeers();
            const interval = setInterval(fetchOnlinePeers, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [isTrainer]);

    // Polling for training results
    useEffect(() => {
        if (monitoringSessionId && resultsData?.status === 'RUNNING') {
            pollingInterval.current = window.setInterval(() => {
                fetchFullResults(monitoringSessionId);
            }, 1000);

            return () => {
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
            };
        }
    }, [monitoringSessionId, resultsData?.status]);

    // Fetch sessions on view change
    useEffect(() => {
        if (view === 'sessions' && !monitoringSessionId) {
            fetchSessions();
        }
    }, [view]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
            if (uptimeInterval.current) {
                clearInterval(uptimeInterval.current);
            }
        };
    }, []);

    const fetchOnlinePeers = async () => {
        try {
            const data = await sessionAPI.getOnlinePeers();
            setOnlinePeersCount(data.online_peers || 0);
        } catch (err) {
            console.error('Failed to fetch online peers:', err);
        }
    };

    const fetchFullResults = async (sessionId: string) => {
        try {
            const data = await sessionAPI.fetchFullResults(sessionId);
            setResultsData(data);
            setError(null);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') {
                onLogout();
            } else {
                console.error('Failed to fetch full results:', err);
                setError(err.message);
            }
        }
    };

    const fetchSessions = async () => {
        try {
            const data = await sessionAPI.fetchSessions();
            setOwnedSessions(data.owned_sessions || []);
            setJoinedSessions(data.joined_sessions || []);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') {
                onLogout();
            } else {
                console.error('Failed to fetch sessions:', err);
            }
        }
    };

    const handleJoinNetwork = async () => {
        setLoading(true);
        setError(null);
        try {
            await sessionAPI.joinNetwork();
            setIsOnline(true);

            // For peer users, navigate to peer node dashboard
            if (isPeer && onPeerJoinNetwork) {
                onPeerJoinNetwork();
            }
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') {
                onLogout();
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveNetwork = async () => {
        setLoading(true);
        try {
            await sessionAPI.leaveNetwork();
            setIsOnline(false);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') {
                onLogout();
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await sessionAPI.startSession(formData);

            if (result.session_uid) {
                setMonitoringSessionId(result.session_uid);
                setTimeout(async () => {
                    await fetchFullResults(result.session_uid);
                }, 1000);
            }
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') {
                onLogout();
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const viewSessionDetails = (session: Session) => {
        setMonitoringSessionId(session._id);
        fetchFullResults(session._id);
    };

    const backToSessions = () => {
        setMonitoringSessionId(null);
        setResultsData(null);
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
        }
        fetchSessions();
    };

    return (
        <div className="page-root dashboard" ref={dashRef}>
            {/* Header */}
            <div className="dash-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="logo">
                        <div className="logo-inner">⚡</div>
                    </div>
                    <h1 className="dash-title">Decentrify</h1>
                    <span className="role-badge" style={{
                        background: isPeer ? 'rgba(249, 115, 22, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                        color: isPeer ? '#f97316' : '#8b5cf6',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: `1px solid ${isPeer ? 'rgba(249, 115, 22, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
                    }}>
                        {userRole}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {/* Online Peers Count for Trainer */}
                    {isTrainer && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22c55e',
                                boxShadow: '0 0 8px #22c55e',
                                animation: 'pulse 2s ease-in-out infinite'
                            }} />
                            <span style={{
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                color: '#22c55e',
                                fontWeight: '700'
                            }}>
                                {onlinePeersCount} Peers Online
                            </span>
                        </div>
                    )}

                    <span className={`status-badge ${isOnline ? 'status-online' : 'status-offline'}`}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>
                        {user?.username || user?.email}
                    </span>
                    {onChangeRole && (
                        <button
                            onClick={onChangeRole}
                            className="change-role-btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#9ca3af',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
                                e.currentTarget.style.color = '#f97316';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.color = '#9ca3af';
                            }}
                        >
                            Change Role
                        </button>
                    )}
                    <button onClick={onLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Training Graphs View - Only for Trainers */}
            {monitoringSessionId && resultsData && isTrainer ? (
                <TrainingGraphs
                    resultsData={resultsData}
                    userRole={userRole}
                    onBack={backToSessions}
                />
            ) : (
                <>
                    {/* Network Status Card */}
                    <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                        <h2 className="section-title">Network Status</h2>

                        {isPeer && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <NeuralNetwork
                                    isTraining={isOnline}
                                    height={200}
                                    numPeers={4}
                                    epochs={10}
                                />
                            </div>
                        )}

                        <p style={{
                            color: 'var(--muted)',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {isOnline
                                ? 'You are connected to the distributed training network'
                                : isPeer
                                    ? 'Join the network to contribute compute power and earn credits'
                                    : 'Join the network to start orchestrating training sessions'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={isOnline ? handleLeaveNetwork : handleJoinNetwork}
                                disabled={loading}
                                className="primary-btn"
                                style={{ width: 'auto' }}
                            >
                                {loading ? (
                                    <div className="spinner" />
                                ) : (
                                    isOnline ? 'Leave Network' : 'Join Network'
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    {/* Tabs */}
                    <div className="tabs" style={{ marginBottom: '2rem' }}>
                        <button
                            className={`tab ${view === 'sessions' ? 'active' : ''}`}
                            onClick={() => setView('sessions')}
                        >
                            My Sessions
                            {view === 'sessions' && <div className="tab-underline" />}
                        </button>
                        {isTrainer && (
                            <button
                                className={`tab ${view === 'create' ? 'active' : ''}`}
                                onClick={() => setView('create')}
                            >
                                Create Session
                                {view === 'create' && <div className="tab-underline" />}
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    {view === 'create' && isTrainer ? (
                        <SessionForm
                            onSubmit={handleStartSession}
                            loading={loading}
                        />
                    ) : (
                        <div className="section">
                            <h2 className="section-title">
                                {isPeer ? 'Joined Sessions' : 'Your Training Sessions'}
                            </h2>
                            <SessionList
                                ownedSessions={ownedSessions}
                                joinedSessions={joinedSessions}
                                userRole={userRole}
                                onViewSession={viewSessionDetails}
                            />
                        </div>
                    )}

                    {/* System Log - Only for Peers when online */}
                    {isPeer && isOnline && (
                        <div style={{
                            marginTop: '3rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>

                        </div>
                    )}
                </>
            )}
        </div>
    );
};