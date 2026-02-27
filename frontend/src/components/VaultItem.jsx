import React, { useState } from 'react';
import { decryptData } from '../services/crypto';
import { Eye, EyeOff, Copy, Trash2, Shield, Check } from 'lucide-react';
import axios from 'axios';

const VaultItem = ({ item, encryptionKey, onDelete }) => {
    const [showPass, setShowPass] = useState(false);
    const [copied, setCopied] = useState(false);

    const decryptedPassword = decryptData(item.encryptedPassword, encryptionKey, item.iv);

    const handleCopy = () => {
        navigator.clipboard.writeText(decryptedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this secure entry?')) {
            try {
                await axios.delete(`http://localhost:5001/api/vault/${item._id}`);
                onDelete();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="glass-card p-8 group transition-all hover:bg-white/[0.02] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 blur-[40px] rounded-full group-hover:bg-accent/10 transition-all" />

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="bg-accent/10 p-3.5 rounded-xl border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                        <Shield size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-white text-base tracking-tight mb-1 uppercase line-clamp-1">{item.siteName}</h3>
                        <p className="text-xs font-bold text-text-muted/80 tracking-wide">{item.identifier}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-danger transition-all rounded-lg hover:bg-danger/10"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between bg-black/60 rounded-xl p-5 border border-white/5 group-hover:border-accent/20 transition-all">
                    <code className="text-sm font-mono font-bold tracking-[0.2em] text-white/90">
                        {showPass ? decryptedPassword : '••••••••••••'}
                    </code>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPass(!showPass)}
                            className="p-2 text-text-muted hover:text-accent transition-colors"
                            title={showPass ? "Hide" : "Show"}
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-2 text-text-muted hover:text-accent transition-colors"
                            title="Copy"
                        >
                            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                    <span className="opacity-40">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2 text-accent/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" /> AES-256
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VaultItem;
