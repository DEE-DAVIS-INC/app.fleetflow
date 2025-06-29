// Database service for FleetFlow
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Load Management
export interface DBLoad {
  id?: string;
  loadNumber: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  status: 'available' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  rate: number;
  weight: string;
  equipment: string;
  carrierName?: string;
  driverName?: string;
  brokerName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DBDriver {
  id?: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehicleId?: string;
  status: 'available' | 'on_route' | 'loading' | 'unloading' | 'off_duty';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  hoursOfService: {
    remaining: number;
    lastReset: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DBVehicle {
  id?: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  plateNumber: string;
  equipmentType: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  driverId?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Load Operations
export const loadService = {
  async getAll(): Promise<DBLoad[]> {
    const q = query(collection(db, 'loads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBLoad));
  },

  async getById(id: string): Promise<DBLoad | null> {
    const docRef = doc(db, 'loads', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DBLoad;
    }
    return null;
  },

  async create(load: Omit<DBLoad, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'loads'), {
      ...load,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<DBLoad>): Promise<void> {
    const docRef = doc(db, 'loads', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'loads', id);
    await deleteDoc(docRef);
  },

  async getByStatus(status: DBLoad['status']): Promise<DBLoad[]> {
    const q = query(
      collection(db, 'loads'), 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBLoad));
  }
};

// Driver Operations
export const driverService = {
  async getAll(): Promise<DBDriver[]> {
    const q = query(collection(db, 'drivers'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBDriver));
  },

  async getById(id: string): Promise<DBDriver | null> {
    const docRef = doc(db, 'drivers', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DBDriver;
    }
    return null;
  },

  async create(driver: Omit<DBDriver, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'drivers'), {
      ...driver,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<DBDriver>): Promise<void> {
    const docRef = doc(db, 'drivers', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async updateLocation(id: string, location: DBDriver['location']): Promise<void> {
    const docRef = doc(db, 'drivers', id);
    await updateDoc(docRef, {
      location,
      updatedAt: Timestamp.now()
    });
  },

  async getAvailable(): Promise<DBDriver[]> {
    const q = query(
      collection(db, 'drivers'), 
      where('status', '==', 'available'),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBDriver));
  }
};

// Vehicle Operations
export const vehicleService = {
  async getAll(): Promise<DBVehicle[]> {
    const q = query(collection(db, 'vehicles'), orderBy('vehicleNumber'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBVehicle));
  },

  async getById(id: string): Promise<DBVehicle | null> {
    const docRef = doc(db, 'vehicles', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DBVehicle;
    }
    return null;
  },

  async create(vehicle: Omit<DBVehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicle,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<DBVehicle>): Promise<void> {
    const docRef = doc(db, 'vehicles', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async getActive(): Promise<DBVehicle[]> {
    const q = query(
      collection(db, 'vehicles'), 
      where('status', '==', 'active'),
      orderBy('vehicleNumber')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DBVehicle));
  }
};

// Batch Operations
export const batchService = {
  async assignLoadToDriver(loadId: string, driverId: string, vehicleId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Update load
    const loadRef = doc(db, 'loads', loadId);
    batch.update(loadRef, {
      status: 'assigned',
      driverId,
      vehicleId,
      updatedAt: Timestamp.now()
    });

    // Update driver
    const driverRef = doc(db, 'drivers', driverId);
    batch.update(driverRef, {
      status: 'on_route',
      vehicleId,
      updatedAt: Timestamp.now()
    });

    // Update vehicle
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    batch.update(vehicleRef, {
      driverId,
      updatedAt: Timestamp.now()
    });

    await batch.commit();
  }
};
