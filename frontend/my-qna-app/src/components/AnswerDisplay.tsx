import React from "react";
import type { QAItem } from "./QnAForm";

interface AnswerDisplayProps {
    answer?: string;
    chatHistory?: QAItem[];
}

export default function AnswerDisplay({ answer, chatHistory }: AnswerDisplayProps) {
    return (
        <div className="mb-6 space-y-4">
            {/* Display chat history */}
            {chatHistory?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="bg-gray-200 p-2 rounded-l-lg rounded-tr-lg max-w-full">
                        <strong>Q:</strong> {item.question}
                    </div>
                    {item.answer && (
                        <div className="bg-blue-100 p-2 rounded-r-lg rounded-tl-lg max-w-full">
                            <strong>A:</strong> {item.answer}
                        </div>
                    )}
                </div>
            ))}

            {/* Current answer (if any) */}
            {answer && (
                <div className="bg-green-100 p-2 rounded max-w-full">
                    <strong>A:</strong> {answer}
                </div>
            )}
        </div>
    );
}