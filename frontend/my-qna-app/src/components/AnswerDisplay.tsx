interface AnswerDisplayProps {
    answer: string;
}

export default function AnswerDisplay({ answer }: AnswerDisplayProps) {
    return (
        <div className="mt-4 p-4 border rounded bg-gray-50 min-h-[80px]">
            {answer || "Your answer will appear here..."}
        </div>
    );
}