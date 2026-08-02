import { useState } from "react";
import axios from "axios";

export default function MeetingChat({ meetingId }) {

    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {

        if (!question.trim()) return;

        const userMessage = {
            role: "user",
            content: question
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/chat`,
                {
                    meetingId,
                    question,
                    history: messages
                }
            );

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.answer,
                    sources: res.data.sources
                }
            ]);

            setQuestion("");

        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="mt-5">

            <h3>Ask AI</h3>

            <div
                style={{
                    height: 350,
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: 15,
                    borderRadius: 8
                }}
            >

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        style={{
                            marginBottom: 20
                        }}
                    >

                        <strong>
                            {msg.role === "user"
                                ? "You"
                                : "AI"}
                        </strong>

                        <p>{msg.content}</p>

                        {msg.sources &&

                            msg.sources.map(source => (

                                <div
                                    key={source.chunkId}
                                    style={{
                                        background: "#f5f5f5",
                                        padding: 8,
                                        borderRadius: 5,
                                        marginTop: 5
                                    }}
                                >

                                    <small>

                                        Chunk {source.chunkId}
                                        {" | "}
                                        Score:
                                        {" "}
                                        {source.score.toFixed(3)}

                                    </small>

                                    <p>{source.text}</p>

                                </div>

                            ))

                        }

                    </div>

                ))}

                {loading &&
                    <p><i>Thinking...</i></p>
                }

            </div>

            <div
                style={{
                    display: "flex",
                    marginTop: 15
                }}
            >

                <input
                    className="form-control"
                    value={question}
                    placeholder="Ask about this meeting..."
                    onChange={(e)=>setQuestion(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key==="Enter")
                            askAI();
                    }}
                />

                <button
                    className="btn btn-primary ms-2"
                    onClick={askAI}
                    disabled={loading}
                >
                    Ask
                </button>

            </div>

        </div>
    );
}