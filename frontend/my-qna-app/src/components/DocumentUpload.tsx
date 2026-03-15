import { useState } from "react";
import type { DragEvent, ChangeEvent } from "react";

interface DocumentUploadProps {
    onUpload: (file: File) => Promise<void>;
}

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const handleFile = async (file: File) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Unsupported file type. Please upload PDF or DOCX.");
            setSelectedFile(null);
            return;
        }

        setError("");
        setSelectedFile(file);
        setLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);

        try {
            await onUpload(file);
        } catch {
            setError("Failed to upload file.");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) handleFile(e.target.files[0]);
    };

    const handleClear = () => {
        setSelectedFile(null);
        setProgress(0);
        setError("");
    };

    return (
        <div className="mb-6 relative">
            <label className="block text-lg font-semibold mb-2">Upload Document</label>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed p-6 text-center rounded cursor-pointer transition ${error ? "border-red-500" : "border-gray-400 hover:border-blue-500"
                    }`}
            >
                {selectedFile ? (
                    <p className="text-green-600 font-medium">{selectedFile.name}</p>
                ) : (
                    <p>Drag & drop a PDF or DOCX here, or click to select a file</p>
                )}
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleInputChange}
                    className="absolute w-full h-full opacity-0 top-0 left-0 cursor-pointer"
                />
            </div>

            {selectedFile && (
                <button
                    onClick={handleClear}
                    className="mt-2 bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400"
                >
                    Clear File
                </button>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {loading && (
                <div className="mt-3 w-full bg-gray-200 h-3 rounded overflow-hidden">
                    <div
                        className="bg-blue-500 h-3 rounded transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}