const API_URL = 'http://10.2.0.152:8081';

export async function fetchDocuments() {
    try {
        const response = await fetch(`${API_URL}/documents`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch documents:', errorText);
            throw new Error('Failed to fetch documents');
        }
        return response.json();
    } catch (error) {
        console.error('Error in fetchDocuments:', error);
        throw error;
    }
}


export async function fetchDocument(id: string) {
  try {
      const response = await fetch(`${API_URL}/documents/${id}`);
      if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return null;
      }
      const document = await response.json();
      return document;
  } catch (error) {
      console.error('Error fetching document:', error);
      return null;
  }
}


export async function updateDocument(id: string, content: Record<string, any>) {
    try {
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to update document with ID ${id}:`, errorText);
            throw new Error('Failed to update document');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in updateDocument:', error);
        throw error;
    }
}



export async function createDocument(type: string) {
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create document:', errorText);
        throw new Error('Failed to create document');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }
  
  




export async function deleteDocument(id: string) {
    try {
        const response = await fetch(`${API_URL}/documents/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to delete document with ID ${id}:`, errorText);
            throw new Error('Failed to delete document');
        }
        return response.json();
    } catch (error) {
        console.error('Error in deleteDocument:', error);
        throw error;
    }
}

export async function searchDocuments(query: string) {
    try {
        const response = await fetch(`${API_URL}/documents/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to search documents:', errorText);
            throw new Error('Failed to search documents');
        }
        return response.json();
    } catch (error) {
        console.error('Error in searchDocuments:', error);
        throw error;
    }
}

export async function getTemplates() {
    try {
        const response = await fetch(`${API_URL}/templates`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch templates:', errorText);
            throw new Error('Failed to fetch templates');
        }
        return response.json();
    } catch (error) {
        console.error('Error in getTemplates:', error);
        throw error;
    }
}
