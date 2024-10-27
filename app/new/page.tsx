"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Doc } from "@/types/document";

export default function NewDocument() {
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
    const defaultTitle = "Untitled Document";
    const defaultContent = "";

    try {
      const response = await fetch("http://localhost:8080/api/document/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: defaultTitle, content: defaultContent }),
      });

      if (response.ok) {
        const newDocument = await response.json().catch(() => null);

        if (newDocument && newDocument.id) {
          router.push(`/document/${newDocument.id}`); // Redirect to the edit page
        } else {
          console.error("Unexpected response format:", newDocument);
          alert("Failed to create document: Invalid response format");
        }
      } else {
        console.error("Server error:", response.statusText);
        alert("Failed to create document");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to create document due to a network error");
    }
  };

  return (
    <div>
      <button onClick={handleCreateDocument}>Create Document</button>

      <h2>Existing Documents</h2>
      <ul>
        {documents?.map((doc) => (
          <li key={doc.id}>
            <a href={`/document/${doc.id}`}>{doc.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
