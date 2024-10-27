"use client";

import { useEffect, useRef, useState } from "react";

export default function DocPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws");
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = () => console.log("Disconnected from WebSocket server");

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === "init") {
        setTitle(update.title);
        setContent(update.content);
      } else if (update.type === "title") {
        setTitle(update.data);
      } else if (update.type === "content") {
        setContent(update.data);
      }
    };

    return () => ws.close();
  }, []);

  const handleTitleChange = (e: { target: { value: any } }) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "title", data: newTitle }));
    }
  };

  // Send changes to server
  const handleContentChange = (e: { target: { value: any } }) => {
    const newText = e.target.value;
    setContent(newText);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "content", data: newText }));
    }
  };

  return (
    <div>
      <input
        type='text'
        value={title}
        onChange={handleTitleChange}
        placeholder='Document Title'
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder='Start writing here...'
      />
    </div>
  );
}
