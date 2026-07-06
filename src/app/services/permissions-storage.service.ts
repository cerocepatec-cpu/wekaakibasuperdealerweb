import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsStorageService {

  private DB_NAME = 'MyAppDB';
  private DB_VERSION = 1;
  private STORE_NAME = 'permissions';

  private permissions: string[] = []; // cache en mémoire

  // BehaviorSubject pour notifier tous les abonnés
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  permissions$ = this.permissionsSubject.asObservable();

  constructor() { }

  // 🔹 Ouvrir IndexedDB
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 🔹 Charger toutes les permissions depuis IndexedDB
  async loadPermissions(): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);

    this.permissions = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.map(r => r.name));
      request.onerror = () => reject(request.error);
    });

    // Notifier les abonnés
    this.permissionsSubject.next([...this.permissions]);
  }

  // 🔹 Sauvegarder et mettre à jour le cache
  async savePermissions(permissions: string[]): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);

    // Vider l’ancienne table
    store.clear();
   permissions.forEach((p, index) => {
      store.add({ name: p });
    });


    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined);
      tx.onerror = () => reject(tx.error);
    });

    // Mettre à jour le cache et notifier
    this.permissions = [...permissions];
    this.permissionsSubject.next([...this.permissions]);
  }

  // 🔹 Mettre à jour depuis le backend / runtime
  async updatePermissions(newPermissions: string[]): Promise<void> {
    await this.savePermissions(newPermissions);
  }

  // 🔹 Vérifier une permission (synchronisé)
  hasPermission(module: string, action: string): boolean {
    const permissionToCheck =String(`${module}.${action}`).toLowerCase();
    return this.permissions.includes(permissionToCheck);
  }

  // 🔹 Vérifier par module seulement
  hasModule(module: string): boolean {
    return this.permissions.some(p => p.startsWith(`${module}.`));
  }

  // 🔹 Récupérer toutes les permissions (synchronisé)
  getAllPermissions(): string[] {
    return [...this.permissions];
  }

  // 🔹 Supprimer toutes les permissions
  async clearPermissions(): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    tx.objectStore(this.STORE_NAME).clear();

    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined);
      tx.onerror = () => reject(tx.error);
    });

    this.permissions = [];
    this.permissionsSubject.next([]);
  }
}
