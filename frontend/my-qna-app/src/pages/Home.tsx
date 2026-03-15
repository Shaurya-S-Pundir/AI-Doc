import { useState } from "react";
import axios from "axios";
import QnAForm from "../components/QnAForm";
import type { QAItem } from "../components/QnAForm";
import DocumentUpload from "../components/DocumentUpload";
import AnswerDisplay from "../components/AnswerDisplay";

export default function Home() {
    const [answer, setAnswer] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<QAItem[]>([]);

    const handleQuestion = async (question: string) => {
        setAnswer(`Fetching answer for: "${question}" ...`);

        // Example backend call
        try {
            const res = await axios.post("http://localhost:8000/query", { question });
            setAnswer(res.data.answer);
            const data = res.data.answer as string;

            setChatHistory((prev) => [...prev, { question, answer: data }]);
        } catch (err) {
            setAnswer("Error fetching answer.");
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("File uploaded:", file.name);
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">AI Document Q&A</h1>

            <QnAForm onSubmit={handleQuestion} />
            <AnswerDisplay answer={answer} />
            <DocumentUpload onUpload={handleFileUpload} />
        </div>
    );
}