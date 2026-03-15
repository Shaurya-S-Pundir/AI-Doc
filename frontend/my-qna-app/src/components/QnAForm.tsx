import { useState } from "react";
import type { FormEvent } from "react";

interface QnAFormProps {
    onSubmit: (question: string) => void;
}

export default function QnAForm({ onSubmit }: QnAFormProps) {
    const [question, setQuestion] = useState<string>("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (question.trim()) onSubmit(question);
        setQuestion("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
            >
                Ask
            </button>
        </form>
    );
}