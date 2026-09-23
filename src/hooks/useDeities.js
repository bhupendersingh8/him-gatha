import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { isFirebaseMock } from './useAuth';

let fallbackPromise = null;

function loadFallback() {
  if (!fallbackPromise) {
    fallbackPromise = import('../data/deities.json').then((module) => module.default);
  }
  return fallbackPromise;
}

export function useDeities() {
  const [state, setState] = useState({
    deities: [],
    source: 'loading',
    warning: null,
  });

  const mockActive = isFirebaseMock();

  useEffect(() => {
    let alive = true;

    // Load initial offline fallback read-only copy
    loadFallback().then((fallback) => {
      if (!alive) return;
      
      if (mockActive) {
        // In mock mode, we exclusively use the fallback data
        setState({
          deities: fallback.filter(d => d.publication?.status === 'published' || d.status === 'approved' || d.status === undefined),
          source: 'fallback',
          warning: 'Offline catalogue loaded in mock mode.',
        });
      } else {
        // Set initial state to fallback while firestore connects
        setState({
          deities: fallback.filter(d => d.publication?.status === 'published' || d.status === 'approved' || d.status === undefined),
          source: 'fallback',
          warning: null,
        });
      }
    });

    if (mockActive) return;

    // Active Firestore Query using the target publication.status field
    const q = query(
      collection(db, 'deities'), 
      where('publication.status', '==', 'published')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!alive) return;
      if (snapshot.empty) {
        // Fallback to static if Firestore is empty
        loadFallback().then((fallback) => {
          if (!alive) return;
          setState({
            deities: fallback.filter(d => d.publication?.status === 'published' || d.status === 'approved' || d.status === undefined),
            source: 'fallback',
            warning: 'Showing static registry; live directory is empty.',
          });
        });
        return;
      }

      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setState({
        deities: list,
        source: 'firestore',
        warning: null,
      });
    }, (err) => {
      console.warn('Firestore subscription failed, maintaining offline catalogue fallback:', err.message);
      if (!alive) return;
      setState(curr => ({
        ...curr,
        source: 'fallback',
        warning: 'Showing offline catalogue; live updates are currently unavailable.',
      }));
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, [mockActive]);

  const getDeity = async (idOrSlug) => {
    if (mockActive) {
      const list = await loadFallback();
      return list.find(d => d.slug === idOrSlug || d.id === idOrSlug) || null;
    }

    try {
      // First try slug query on Firestore
      const q = query(collection(db, 'deities'), where('slug', '==', idOrSlug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }

      // Next try document ID on Firestore
      const docRef = doc(db, 'deities', idOrSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // Read-only static search fallback
      const list = await loadFallback();
      return list.find(d => d.slug === idOrSlug || d.id === idOrSlug) || null;
    } catch (err) {
      console.warn('Firestore fetch failed, seeking local fallback:', err);
      const list = await loadFallback();
      return list.find(d => d.slug === idOrSlug || d.id === idOrSlug) || null;
    }
  };

  const addDeity = async (deityData) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock mode.');
    }
    const newDeity = {
      ...deityData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const docRef = doc(db, 'deities', deityData.id);
    await setDoc(docRef, newDeity);
    return newDeity;
  };

  const updateDeity = async (id, updatedFields) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }
    const docRef = doc(db, 'deities', id);
    const updateData = { ...updatedFields, updatedAt: new Date().toISOString() };
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  };

  const deleteDeity = async (id) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }
    const docRef = doc(db, 'deities', id);
    await deleteDoc(docRef);
  };

  return {
    deities: state.deities,
    source: state.source,
    warning: state.warning,
    loading: state.source === 'loading',
    isMock: mockActive,
    getDeity,
    addDeity,
    updateDeity,
    deleteDeity
  };
}
