import { parseJwt } from "@/lib/parser";

export const getDocuments = async () => {
  const response = await fetch("http://localhost:8080/api/documents");
  const data = await response.json();
  return data;
};

export const getDocument = async (id: string) => {
  const response = await fetch(`http://localhost:8080/api/document/${id}`);
  const data = await response.json();
  return data;
};

export const createDocument = async () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const accountID = parseJwt(token || "").user_id;
  console.log(accountID);
  const defaultTitle = "Untitled Document";
  const defaultContent = "";
  const requestBody = JSON.stringify({
    title: defaultTitle,
    content: defaultContent,
    owner_id: accountID,
  });
  console.log(requestBody);
  const response = await fetch("http://localhost:8080/api/document/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  if (response.ok) {
    const newDocument = await response.json();
    if (newDocument && newDocument.id) {
      return newDocument;
    } else {
      console.error("Failed to create document: Invalid response format");
    }
  } else {
    console.error("Failed to create document");
  }
};

export const saveDocument = async (title: string, content: string) => {
  const response = await fetch("http://localhost:8080/api/document/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ title, content }),
  });

  if (response.ok) {
    const newDocument = await response.json().catch(() => null);

    if (newDocument && newDocument.id) {
      return newDocument;
    } else {
      console.error("Failed to save document: Invalid response format");
    }
  } else {
    console.error("Failed to save document");
  }
};
