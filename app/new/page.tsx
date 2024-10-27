"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Doc } from "@/types/document";

export default function NewDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documents, setDocuments] = useState<Doc[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const response = await fetch("http://localhost:8080/api/documents");
    const data = await response.json();
    setDocuments(data);
  };

  const handleCreateDocument = async () => {
    const response = await fetch("http://localhost:8080/api/document/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      const newDocument = await response.json();
      // Optionally redirect or show success
      router.push(`/edit/${newDocument.id}`); // Redirect to the edit page
    } else {
      alert("Failed to create document");
    }
  };

  return (
    <div>
      <h1>Create New Document</h1>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Document Title'
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Start writing here...'
      />
      <button onClick={handleCreateDocument}>Create Document</button>

      <h2>Existing Documents</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <a href={`/edit/${doc.id}`}>{doc.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
