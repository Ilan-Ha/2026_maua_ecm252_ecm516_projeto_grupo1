import fs from 'fs';

const initialData = { "users": []};
const filePath = 'UserDatabase.json';

function saveData(dataObject) {
  const jsonString = JSON.stringify(dataObject, null, 2);
  fs.writeFileSync(filePath, jsonString);
}

export function retrieveData() {
  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } else {
      // If file doesn't exist, initialize it
      saveData(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Error reading data:', error);
    return initialData;
  }
}

export function addItem(newItem) {
  const currentData = retrieveData();

  // Ensure array exists (extra safety)
  if (!Array.isArray(currentData.users)) {
    currentData.users = [];
  }

  currentData.users.push(newItem);

  saveData(currentData);
}

