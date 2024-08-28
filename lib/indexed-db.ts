"client only";

export function openDB(
  dbName: string,
  storeName: string,
  version: number = 1,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = function (event) {
      reject((event.target as IDBOpenDBRequest).error?.message);
    };
  });
}

export function addFile(
  db: IDBDatabase,
  storeName: string,
  file: File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(file);

    request.onsuccess = function () {
      resolve(request.result.toString());
    };

    request.onerror = function (event) {
      reject((event.target as IDBRequest).error?.message);
    };
  });
}

export function getFile(
  db: IDBDatabase,
  storeName: string,
  id: number,
): Promise<File | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = function () {
      resolve(request.result as File | undefined);
    };

    request.onerror = function (event) {
      reject((event.target as IDBRequest).error?.message);
    };
  });
}
