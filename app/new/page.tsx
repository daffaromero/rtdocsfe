"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Doc } from "@/types";
import { createDocument, getDocuments } from "@/api/documents/documents";
import { checkAuth, createGuestAccount } from "@/api/auth";

export default function NewDocument() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const router = useRouter();
  useEffect(() => {
    const initialize = async () => {
      console.log("Initializing");
      let isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        await createGuestAccount();
      }
      const docs = await getDocuments();
      setDocuments(docs);
    };

    initialize();
  }, []);

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
