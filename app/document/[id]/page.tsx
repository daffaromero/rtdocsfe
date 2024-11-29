"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Menubar } from "@/components/ui/menubar";
import { getDocument, saveDocument } from "@/api/documents/documents";

export default function DocPage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getDocument(pathname.split("/")[2]).then((doc) => {
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
      }
    });
  }, [pathname]);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080/ws/${pathname.split("/")[2]}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to WebSocket server");
    ws.onclose = () => console.log("Disconnected from WebSocket server");

    ws.onmessage = (event) => {
      try {
        if (event.data) {
          const update = JSON.parse(event.data);
          if (update.type === "init") {
            setTitle(update.title);
            setContent(update.content);
          } else if (update.type === "title") {
            setTitle(update.data);
          } else if (update.type === "content") {
            setContent(update.data);
          }
        } else {
          console.warn("Received empty WebSocket message");
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => ws.close();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "title", data: newTitle }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "content", data: newText }));
    }
  };

  return (
    <div className='flex flex-col items-center p-4 bg-gray-100 min-h-screen'>
      {/* Header Menubar */}
      <Menubar className='w-full max-w-3xl flex justify-between items-center mb-4 p-2 bg-white shadow'>
        <div>
          <Button
            variant='default'
            className='mr-2'
            onClick={() => {
              saveDocument(pathname.split("/")[2], title, content).then(
                (doc) => {
                  router.push(`/document/${doc.id}`);
                }
              );
            }}
          >
            Save
          </Button>
          <Button variant='secondary'>Share</Button>
        </div>
        <div>
          <Button variant='ghost'>Account</Button>
        </div>
      </Menubar>

      {/* Document Container */}
      <Card className='w-full max-w-3xl bg-white shadow'>
        <CardContent className='p-6'>
          <Input
            type='text'
            value={title}
            onChange={handleTitleChange}
            placeholder='Document Title'
            className='w-full mb-4 text-2xl font-semibold border-none outline-none focus:ring-0'
          />

          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder='Start writing here...'
            className='w-full h-[70vh] resize-none border-none outline-none focus:ring-0'
          />
        </CardContent>
      </Card>
    </div>
  );
}
