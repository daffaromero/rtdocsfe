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
  const defaultTitle = "Untitled Document";
  const defaultContent = "";

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
      return newDocument;
    } else {
      throw new Error("Failed to create document: Invalid response format");
    }
  } else {
    throw new Error("Failed to create document");
  }
}

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
      throw new Error("Failed to create document: Invalid response format");
    }
  } else {
    throw new Error("Failed to create document");
  }
};