const API_URL = 'http://10.2.0.152:8000';

interface Document {
  id: string;
  type: string;
  fields: Record<string, string>;
}

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_URL}/documents`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getDocument = async (id: string): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createDocument = async (type: string): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateDocument = async (id: string, data: { fields: Record<string, string> }): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
