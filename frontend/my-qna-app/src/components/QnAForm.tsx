import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

interface QnAFormProps {
    onSubmit: (question: string) => void;
}

export type QAItem = {
    question: string;
    answer?: string;
    source?: string;
    loading?: boolean;
};

export default function QnAForm({ onSubmit }: QnAFormProps) {
    const [question, setQuestion] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!question.trim()) return;

        onSubmit(question);
        setQuestion("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="border rounded p-2 w-full mb-2"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
            >
                Ask
            </button>
        </form>
    );
}