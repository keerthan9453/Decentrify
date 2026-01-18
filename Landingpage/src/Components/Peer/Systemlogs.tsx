// SystemLog.tsx - Real-time backend logs viewer
import React, { useState, useEffect, useRef } from 'react';
import type { FullResultsResponse } from '../types';

interface SystemLogProps {
    resultsData: FullResultsResponse | null;
    uptime: number;
    sessionId: string | null;
}

interface LogEntry {
    peer_id: string;
    log_level: string;
    message: string;
    timestamp?: string;
}

const API_BASE = 'http://localhost:8000';

export const SystemLog: React.FC<SystemLogProps> = ({ resultsData, uptime, sessionId }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);
    const pollingInterval = useRef<number | null>(null);

    useEffect(() => {
        if (sessionId) {
            // Fetch logs immediately
            fetchLogs();

            // Then poll every 2 seconds
            pollingInterval.current = window.setInterval(() => {
                fetchLogs();
            }, 2000);

            return () => {
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                }
            };
        }
    }, [sessionId]);

    useEffect(() => {
        // Auto-scroll to bottom
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const fetchLogs = async () => {
        if (!sessionId) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/sessions/${sessionId}/logs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // data should be an array of log entries
                if (Array.isArray(data) && data.length > 0) {
                    setLogs(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    const formatUptime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getLogColor = (logLevel: string) => {
        const level = logLevel.toUpperCase();
        if (level.includes('ERROR')) return '#ef4444';
        if (level.includes('WARNING') || level.includes('WARN')) return '#f97316';
        if (level.includes('SUCCESS')) return '#22c55e';
        return '#d1d5db';
    };

    const contributionActive = resultsData?.status === 'RUNNING';

    return (
        <>
            {/* Uptime Card */}
            <div style={{
                background: 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.3), transparent)'
                }} />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Uptime
                    </span>
                    <span style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255, 85, 0, 0.5)'
                    }}>
                        ⏱
                    </span>
                </div>
                <div>
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        letterSpacing: '-0.05em'
                    }}>
                        {formatUptime(uptime)}
                    </div>
                    <div style={{
                        fontSize: '10px',
                        color: '#FF5500',
                        fontFamily: 'monospace',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: contributionActive ? '#FF5500' : '#6b7280',
                            animation: contributionActive ? 'pulse 2s ease-in-out infinite' : 'none'
                        }} />
                        {contributionActive ? 'Contribution Active' : 'Idle'}
                    </div>
                </div>
            </div>

            {/* System Log */}
            <div style={{
                background: '#050505',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
            }}>
                {/* Log Header */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: '#9ca3af',
                        textTransform: 'uppercase'
                    }}>
                        System Log › Peer_Node_01
                    </span>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.5)'
                        }} />
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'rgba(234, 179, 8, 0.2)',
                            border: '1px solid rgba(234, 179, 8, 0.5)'
                        }} />
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: contributionActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                            border: `1px solid ${contributionActive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(107, 114, 128, 0.5)'}`
                        }} />
                    </div>
                </div>

                {/* Log Content */}
                <div style={{
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    lineHeight: '1.8'
                }}>
                    {logs.length === 0 ? (
                        <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                            Waiting for logs...
                        </div>
                    ) : (
                        logs.map((log, idx) => (
                            <div key={idx} style={{
                                marginBottom: '0.125rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.125rem'
                            }}>
                                {/* Peer ID line */}
                                <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                                    {log.peer_id}
                                </div>
                                {/* Log message line */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{
                                        color: getLogColor(log.log_level),
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>
                                        {log.log_level}:
                                    </span>
                                    <span style={{ color: '#d1d5db', flex: 1, wordBreak: 'break-word' }}>
                                        {log.message}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={logEndRef} />
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #0a0a0a;
                }
                ::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </>
    );
};