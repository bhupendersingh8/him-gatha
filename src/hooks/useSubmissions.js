import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { isFirebaseMock } from './useAuth';

let cachedMockSubmissions = null;

const getMockSubmissions = () => {
  if (cachedMockSubmissions !== null) {
    return cachedMockSubmissions;
  }
  const stored = localStorage.getItem('mock_submissions');
  if (stored) {
    try {
      cachedMockSubmissions = JSON.parse(stored);
      return cachedMockSubmissions;
    } catch {
      cachedMockSubmissions = [];
      return cachedMockSubmissions;
    }
  }
  cachedMockSubmissions = [];
  return cachedMockSubmissions;
};

const saveMockSubmissions = (subs) => {
  cachedMockSubmissions = subs;
  localStorage.setItem('mock_submissions', JSON.stringify(subs));
};

export function useSubmissions() {
  const mockActive = isFirebaseMock();
  const [submissions, setSubmissions] = useState(() => {
    if (mockActive) {
      return getMockSubmissions();
    }
    return [];
  });
  const [loading, setLoading] = useState(!mockActive);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mockActive) {
      const handleStorageChange = (e) => {
        if (e.key === 'mock_submissions') {
          cachedMockSubmissions = null;
          setSubmissions(getMockSubmissions());
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(list);
      setLoading(false);
    }, (err) => {
      console.warn('Firestore real-time subscription failed, using fallback:', err.message);
      setSubmissions(getMockSubmissions());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mockActive]);

  const submitDeity = async (data) => {
    const newSubmission = {
      name: data.name,
      district: data.district,
      village: data.village,
      description: data.description,
      images: data.images || [],
      coordinates: data.coordinates || { lat: null, lng: null },
      status: 'pending',
      submittedBy: data.submitterName || 'anonymous',
      submitterEmail: data.submitterEmail || '',
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null
    };

    if (mockActive) {
      const list = getMockSubmissions();
      const submissionWithId = { ...newSubmission, id: 'sub-' + Math.random().toString(36).substring(2, 11) };
      const updatedList = [submissionWithId, ...list];
      saveMockSubmissions(updatedList);
      setSubmissions(updatedList);
      return submissionWithId;
    }

    try {
      const docRef = await addDoc(collection(db, 'submissions'), newSubmission);
      return { ...newSubmission, id: docRef.id };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const approveSubmission = async (subId, finalData, adminEmail) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }

    const timestamp = new Date().toISOString();
    const approvedDeity = {
      ...finalData,
      status: 'approved',
      submittedBy: finalData.submittedBy || 'contribution',
      updatedAt: timestamp
    };
    if (!approvedDeity.createdAt) {
      approvedDeity.createdAt = timestamp;
    }

    try {
      const deityDocRef = doc(db, 'deities', approvedDeity.id);
      await setDoc(deityDocRef, approvedDeity);

      const subDocRef = doc(db, 'submissions', subId);
      const reviewUpdate = {
        status: 'approved',
        reviewedBy: adminEmail,
        reviewedAt: timestamp
      };
      await updateDoc(subDocRef, reviewUpdate);
      return approvedDeity;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAndApproveSubmission = async (subId, updatedData, adminEmail) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }

    const timestamp = new Date().toISOString();
    try {
      const subDocRef = doc(db, 'submissions', subId);
      const updatePayload = {
        ...updatedData,
        updatedAt: timestamp
      };
      await updateDoc(subDocRef, updatePayload);
      return await approveSubmission(subId, { ...updatedData, id: subId }, adminEmail);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectSubmission = async (subId, reason, adminEmail) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }

    const timestamp = new Date().toISOString();
    const reviewUpdate = {
      status: 'rejected',
      reviewedBy: adminEmail,
      reviewedAt: timestamp,
      rejectionReason: reason || 'Information incomplete'
    };

    try {
      const subDocRef = doc(db, 'submissions', subId);
      await updateDoc(subDocRef, reviewUpdate);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSubmission = async (subId) => {
    if (mockActive) {
      throw new Error('Modifying the archive is disabled in mock/fallback mode.');
    }

    try {
      const subDocRef = doc(db, 'submissions', subId);
      await deleteDoc(subDocRef);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    submissions,
    loading,
    error,
    isMock: mockActive,
    submitDeity,
    approveSubmission,
    updateAndApproveSubmission,
    rejectSubmission,
    deleteSubmission
  };
}
