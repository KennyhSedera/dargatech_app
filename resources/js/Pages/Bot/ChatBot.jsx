import { formatRelativeDate } from "@/hooks/fomatDate";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

function ChatBot() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const userPhone = "+261349287065";
    const chatContainerRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const url = "https://dargatech.crm.railway.app/" || "http://localhost:3001/";

    const sendMessage = async () => {
        if (!message) return;

        setChat([...chat, { text: message, sender: "Bot", created_at: new Date() }]);
        setMessage("");

        await fetch(`${url}sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: userPhone, message }),
        });

        setTimeout(fetchMessages, 1000);
    };

    const fetchMessages = async () => {
        const response = await fetch(`${url}messages/${userPhone}`);
        const data = await response.json();
        setChat(data);
    };

    useEffect(() => {
        if (userPhone) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 2000);
            return () => clearInterval(interval);
        }
    }, [userPhone]);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer && isAtBottom) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chat]);

    const handleScroll = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            const isUserAtBottom =
                chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
            setIsAtBottom(isUserAtBottom);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bot Telegram" />
            <div className="h-[calc(100vh-74px)] w-3/4 flex flex-col">
                <h2 className="p-4 border-b font-semibold text-xl">{chat[0]?.sender}</h2>

                <div
                    className="flex-1 overflow-auto px-4 py-2 custom-scrollbar"
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                >
                    {chat.map((msg, index) => (
                        <div key={index} className={`w-full flex ${msg.sender === "Bot" ? "justify-end" : "justify-start"}`}>
                            <div className="max-w-md mb-2 flex flex-col">
                                <div className={`${msg.sender === "Bot" ? "bg-red-400" : "bg-green-400"} px-4 py-2 rounded-xl`}>
                                    {msg.text}
                                </div>
                                <div className={`text-xs text-gray-500 ${msg.sender === "Bot" ? "text-end" : "text-start"}`}>
                                    {formatRelativeDate(msg.created_at)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-2 flex items-center gap-2 border-t">
                    <textarea
                        className="flex-1 p-2 rounded-lg bg-transparent border border-gray-300 focus:ring-2 focus:ring-blue-700"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Écris un message..."
                    />
                    <button className="px-4 py-2 bg-blue-400 text-white rounded-lg" onClick={sendMessage}>
                        Envoyer
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ChatBot;
