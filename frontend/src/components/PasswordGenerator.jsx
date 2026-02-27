import React from 'react';
import { RefreshCw } from 'lucide-react';

const PasswordGenerator = ({ onGenerate }) => {
    const generate = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 16; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        onGenerate(retVal);
    };

    return (
        <button
            type="button"
            onClick={generate}
            className="text-xs text-accent hover:text-white flex items-center gap-1.5 transition-colors font-medium"
        >
            <RefreshCw size={14} /> Generate Strong Password
        </button>
    );
};

export default PasswordGenerator;
