import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateSalt } from '../services/crypto';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login, signup, user, encryptionKey } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user && encryptionKey) {
            navigate('/dashboard');
        }
    }, [user, encryptionKey, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const salt = generateSalt();
                await signup(email, password, salt);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-pure relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="container-sm animate-fade-in relative z-10">
                <div className="glass-card p-12 border-white/10">
                    <div className="text-center mb-12">
                        <div className="bg-white/5 p-5 rounded-3xl w-fit mx-auto mb-8 border border-white/10 shadow-2xl">
                            <Lock className="text-accent" size={32} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter mb-4 decoration-accent underline-offset-8">
                            {isLogin ? 'Unlock' : 'Initialize'}
                        </h1>
                        <p className="text-text-muted text-sm px-6 font-medium leading-relaxed">
                            {isLogin
                                ? 'Enter your master authorization to decrypt the vault.'
                                : 'Define your encryption key. Ensure it is unique and memorable.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-xs font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="label">Authorization ID</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
                                <input
                                    type="email"
                                    className="input-field pl-12"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="label">Master Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
                                <input
                                    type="password"
                                    className="input-field pl-12"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {!isLogin && (
                                <div className="mt-4 p-4 bg-accent/5 rounded-xl border border-accent/10">
                                    <p className="text-[11px] text-accent font-bold leading-relaxed uppercase tracking-wider text-center">
                                        Warning: This key is never stored. Lost keys mean permanent data loss.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn-primary w-full mt-6 h-14 text-base" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'Grant Access' : 'Create Vault')}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-accent transition-all"
                        >
                            {isLogin ? "Provision New Vault" : "Return to Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
