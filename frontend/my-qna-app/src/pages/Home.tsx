import { useState } from "react";
import QnAForm from "../components/QnAForm";
import AnswerDisplay from "../components/AnswerDisplay";

<div className="bg-blue-500 text-white p-4 rounded">
    Tailwind is working!
</div>

export default function Home() {
    const [answer, setAnswer] = useState<string>("");

    const handleQuestion = (question: string) => {
        // TEMP: mock response until backend is ready
        setAnswer(`Fetching answer for: "${question}" ...`);
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">AI Document Q&A</h1>

            {/* Tailwind test div */}
            <div className="bg-blue-500 text-white p-4 rounded mb-4">
                Tailwind is working!
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center text-red-500">
                AI Document Q&A
            </h1>

            <QnAForm onSubmit={handleQuestion} />
            <AnswerDisplay answer={answer} />
        </div>
    );
}