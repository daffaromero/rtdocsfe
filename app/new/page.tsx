"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Doc } from "@/types/document";
import { createDocument, getDocuments } from "@/api/documents/documents";

export default function NewDocument() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const router = useRouter();
  useEffect(() => {
    getDocuments().then((docs) => {
      setDocuments(docs);
    });
  }, [documents]);

  return (
    <div>
      <button
        onClick={() => {
          createDocument().then((newDoc) => {
            router.push(`/document/${newDoc.id}`);
          });
        }}
      >
        Create Document
      </button>

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
