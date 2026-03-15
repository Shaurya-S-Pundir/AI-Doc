interface ChatMessageProps {
    question: string;
    answer?: string;
    source?: string;
    loading?: boolean; // new prop
}

export default function ChatMessage({ question, answer, source, loading }: ChatMessageProps) {
    return (
        <div className="mb-4 p-3 rounded shadow bg-white">
            <p className="font-semibold text-blue-600">Q: {question}</p>

            {loading ? (
                <div className="mt-1 text-gray-900 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Fetching answer...</span>
                </div>
            ) : (
                <>
                    <p className="mt-1 text-gray-900">A: {answer}</p>
                    {source && <p className="mt-1 text-sm text-gray-500">Source: {source}</p>}
                </>
            )}
        </div>
    );
}