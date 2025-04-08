import { useState } from "react";
import axios from "axios";

const Gemini = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!input) return;

        const newMessages = [...messages, { text: input, sender: "you" }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await axios.post("/geminichat", { message: input +""});

            setMessages([...newMessages, { text: response.data.response, sender: "Gemini" }]);
        } catch (error) {
            console.error(error);
            setMessages([...newMessages, { text: "Error getting response", sender: "Gemini" }]);
        }
    };

    return (
        <div class="h-auto w-[30%] overflow-x-hidden">
            <div class="h-[93%] border border-[#ffffff1c] p-[10px] whitespace-normal break-words overflow-hidden">
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === "you" ? "right" : "left" }}>
                        <b>{msg.sender}:</b> {msg.text}
                    </div>
                ))}
            </div>
           
              <input
        type="text"
        placeholder="Hi I am Gemini, how may I help you?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-[80%] h-10 border border-[#0000001e] px-4 text-sm focus:outline-none focus:ring-1"
      />
            <button className= "h-10 w-[20%] bg-gray-800 text-white px-4 py-2 hover:bg-gray-900 transition"
            onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Gemini;
