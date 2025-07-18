import React, { useRef, useState } from 'react';

interface FileUploadProps {
    label?: string;
    onFileChange: (file: File | null) => void;
    value?: File | null;
    accept?: string;
    maxSizeMB?: number;
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileChange, value, accept = 'image/*', maxSizeMB = 2, error }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                setLocalError(`File size exceeds ${maxSizeMB}MB limit.`);
                onFileChange(null);
                setPreview(null);
                return;
            }
            if (!file.type.startsWith('image/')) {
                setLocalError('Only image files are allowed.');
                onFileChange(null);
                setPreview(null);
                return;
            }
            setLocalError(null);
            setPreview(URL.createObjectURL(file));
            onFileChange(file);
        } else {
            setLocalError(null);
            setPreview(null);
            onFileChange(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="font-medium mb-1">{label}</label>}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="border rounded px-2 py-1"
            />
            {preview && (
                <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded border" />
            )}
            {(localError || error) && (
                <span className="text-red-500 text-xs">{localError || error}</span>
            )}
        </div>
    );
};

export default FileUpload;
