import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const AiTest: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws");
    
    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = event.data;
        } else {
          newMessages.push({"role": "assistant", "content": event.data});
        }
        return newMessages;
      });
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && inputMessage.trim()) {
      const updatedMessages = [...messages, {"role": "user", "content": inputMessage}];
      ws.send(JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background p-4 border-b">
        <h1 className="text-2xl font-bold text-center">AI Test Space</h1>
      </header>
      <main className="flex-grow flex p-8 gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a simple placement UI for testing AI components.</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>AI Chat (websocket)</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full pr-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                </div>
              ))}
            </ScrollArea>
            <div className="flex mt-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-background p-4 border-t text-center">
        <p className="text-sm text-muted-foreground">&copy; 2023 AI Test Company</p>
      </footer>
    </div>
  );
};

export default AiTest;
