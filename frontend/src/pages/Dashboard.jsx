import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { encryptData, decryptData } from '../services/crypto';
import VaultItem from '../components/VaultItem';
import PasswordGenerator from '../components/PasswordGenerator';
import { Plus, LogOut, Search, ShieldCheck, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user, encryptionKey, logout } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');

    // Form State
    const [siteName, setSiteName] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/vault');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const encrypted = encryptData(password, encryptionKey);
            await axios.post('http://localhost:5001/api/vault', {
                siteName,
                identifier, // In a real app, you might encrypt this too
                encryptedPassword: encrypted.encryptedData,
                iv: encrypted.iv
            });
            setSiteName('');
            setIdentifier('');
            setPassword('');
            setShowAdd(false);
            fetchItems();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.siteName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-dark">
            <nav className="border-b border-glass-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
                <div className="container-md h-20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <ShieldCheck className="text-white" size={22} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">KryptVault</h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="text-xs font-semibold text-text-muted hidden md:inline tracking-wide uppercase">{user?.email}</span>
                        <button onClick={logout} className="p-2.5 hover:bg-danger/10 text-text-muted hover:text-danger rounded-full transition-all border border-transparent hover:border-danger/20">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container-md px-8 py-16">
                <div className="flex flex-col md:flex-row gap-6 mb-16 items-stretch animate-fade-in">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/50" size={20} />
                        <input
                            type="text"
                            placeholder="Search your secure vault..."
                            className="input-field pl-14 h-16"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className={`h-16 px-10 rounded-xl font-extrabold transition-all flex items-center justify-center gap-3 whitespace-nowrap ${showAdd ? 'bg-white/5 text-white border border-white/10' : 'bg-white text-black hover:scale-[1.02]'
                            }`}
                    >
                        {showAdd ? 'Close' : <><Plus size={22} strokeWidth={3} /> New Entry</>}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-card p-12 mb-16 border-white/10 animate-fade-in overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] rounded-full" />
                        <h2 className="text-2xl font-black mb-10 tracking-tight">Secure New Entry</h2>
                        <form onSubmit={handleAddItem} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="label">Service Name</label>
                                    <input
                                        className="input-field"
                                        placeholder="e.g. AWS, Github"
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="label">Access ID / Email</label>
                                    <input
                                        className="input-field"
                                        placeholder="username"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="label">Secure Password</label>
                                <div className="max-w-lg">
                                    <input
                                        type="password"
                                        className="input-field"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="mt-5">
                                        <PasswordGenerator onGenerate={setPassword} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5 pt-10 border-t border-white/5 mt-12">
                                <button type="submit" className="btn-primary h-14 px-12" disabled={saving}>
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : 'Save entry'}
                                </button>
                                <button type="button" onClick={() => setShowAdd(false)} className="px-8 text-sm font-bold text-text-muted hover:text-white transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">Credentials ({filteredItems.length})</h3>
                    <div className="h-[1px] flex-1 bg-white/5 mx-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => <div key={i} className="glass-card h-48 animate-pulse border-white/5" />)
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <VaultItem
                                key={item._id}
                                item={item}
                                encryptionKey={encryptionKey}
                                onDelete={fetchItems}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center glass-card border-dashed border-white/10 bg-white/[0.01]">
                            <p className="text-text-muted text-sm font-medium tracking-wide">Infrastructure ready. No entries found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
