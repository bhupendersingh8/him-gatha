import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubmissions } from '../hooks/useSubmissions';
import { useDeities } from '../hooks/useDeities';
import { Check, X, Trash2, AlertCircle, Loader2, Edit2, ShieldAlert } from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Route security gate: verify administrative privilege
  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        navigate('/him-admin/login', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const { 
    submissions, 
    loading: submissionsLoading, 
    error: submissionsError, 
    updateAndApproveSubmission,
    rejectSubmission, 
    deleteSubmission 
  } = useSubmissions();

  const { deities, loading: deitiesLoading } = useDeities();

  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'live_archive'
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Side-by-side editing data state
  const [editData, setEditData] = useState(null);

  // Stats calculation
  const stats = useMemo(() => {
    const totalSubmissions = submissions ? submissions.length : 0;
    const pending = submissions ? submissions.filter(s => s.status === 'pending').length : 0;
    const approved = submissions ? submissions.filter(s => s.status === 'approved').length : 0;
    const rejected = submissions ? submissions.filter(s => s.status === 'rejected').length : 0;
    return { totalSubmissions, pending, approved, rejected };
  }, [submissions]);

  const handleApproveClick = (submission) => {
    setSelectedSubmission(submission);
    setEditData({ ...submission });
  };

  const submitApproval = async () => {
    try {
      // Execute the updateAndApprove inline pipeline mutation
      await updateAndApproveSubmission(selectedSubmission.id, editData, user.email);
      setSelectedSubmission(null);
      setEditData(null);
    } catch (err) {
      console.error(err);
      alert('Error approving submission: ' + err.message);
    }
  };

  const handleRejectClick = (submission) => {
    setSelectedSubmission(submission);
    setIsRejectModalOpen(true);
    setRejectReason('');
  };

  const submitRejection = async () => {
    try {
      await rejectSubmission(selectedSubmission.id, rejectReason, user.email);
      setIsRejectModalOpen(false);
      setSelectedSubmission(null);
    } catch (err) {
      console.error(err);
      alert('Error rejecting submission: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this submission?')) {
      try {
        await deleteSubmission(id);
      } catch (err) {
        console.error(err);
        alert('Error deleting submission: ' + err.message);
      }
    }
  };

  if (authLoading || submissionsLoading || deitiesLoading) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)] mb-4" />
        <p className="text-[var(--text-secondary)] font-sans">Verifying security credentials...</p>
      </div>
    );
  }

  // Double check gating
  if (!user || (user.email.toLowerCase() !== "himgatha.admin@gmail.com" && user.email.toLowerCase() !== "admin@himgatha.local")) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center bg-[var(--bg-primary)] text-red-600 font-sans">
        <ShieldAlert className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm text-[var(--text-muted)]">Unauthorized identity detected.</p>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-2">Sacred Moderation Panel</h1>
            <p className="text-xs text-[var(--text-secondary)] font-sans uppercase tracking-[0.2em]">Authorized: {user?.email}</p>
          </div>
          
          {/* Stats Bar */}
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <div className="glass px-4 py-2 rounded-lg border border-[var(--border-color)] text-center min-w-[100px]">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Total entries</p>
              <p className="text-xl font-serif text-[var(--text-primary)]">{stats.totalSubmissions}</p>
            </div>
            <div className="glass px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/5 text-center min-w-[100px]">
              <p className="text-[10px] text-amber-500/70 uppercase tracking-wider mb-1">Pending Review</p>
              <p className="text-xl font-serif text-amber-500">{stats.pending}</p>
            </div>
            <div className="glass px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/5 text-center min-w-[100px]">
              <p className="text-[10px] text-green-500/70 uppercase tracking-wider mb-1">Approved</p>
              <p className="text-xl font-serif text-green-500">{stats.approved}</p>
            </div>
          </div>
        </div>

        {submissionsError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{submissionsError}</p>
          </div>
        )}

        {/* Console view switching tabs */}
        <div className="flex border-b border-[var(--border-color)] mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('moderation')}
            className={`px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'moderation' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Pending Moderation Queue ({pendingSubmissions.length})
          </button>
          <button 
            onClick={() => setActiveTab('live_archive')}
            className={`px-6 py-4 font-serif text-lg whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'live_archive' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Live Active Archive ({deities.length})
          </button>
        </div>
        
        {activeTab === 'moderation' ? (
          <div className="glass-card rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Entity Name</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">District</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Submitted By</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Coordinates</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Date</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-[var(--text-muted)] italic font-serif">
                        No submissions currently pending moderation review.
                      </td>
                    </tr>
                  ) : (
                    pendingSubmissions.map(sub => (
                      <tr key={sub.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="p-4 font-medium text-[var(--text-primary)]">{sub.name}</td>
                        <td className="p-4 text-[var(--text-secondary)] text-sm">{sub.district}</td>
                        <td className="p-4 text-[var(--text-secondary)] text-sm">
                          {sub.submittedBy}
                          {sub.submitterEmail && <span className="block text-xs text-[var(--text-muted)]">{sub.submitterEmail}</span>}
                        </td>
                        <td className="p-4 text-[var(--text-secondary)] text-sm font-mono">
                          {sub.coordinates?.lat ? `${sub.coordinates.lat.toFixed(4)}, ${sub.coordinates.lng.toFixed(4)}` : 'None'}
                        </td>
                        <td className="p-4 text-[var(--text-secondary)] text-sm">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleApproveClick(sub)}
                              className="p-1.5 rounded-md text-green-600 hover:bg-green-500/10 transition-colors flex items-center gap-1 text-xs"
                              title="Review & Approve"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Review / Edit
                            </button>
                            <button 
                              onClick={() => handleRejectClick(sub)}
                              className="p-1.5 rounded-md text-red-600 hover:bg-red-500/10 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(sub.id)}
                              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Entity Name</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">District</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Region</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm">Coordinates</th>
                    <th className="p-4 font-medium text-[var(--text-secondary)] text-sm text-right">Reference Links</th>
                  </tr>
                </thead>
                <tbody>
                  {deities.map(deity => (
                    <tr key={deity.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{deity.name}</td>
                      <td className="p-4 text-[var(--text-secondary)] text-sm">{deity.district}</td>
                      <td className="p-4 text-[var(--text-secondary)] text-sm">{deity.region || 'N/A'}</td>
                      <td className="p-4 text-[var(--text-secondary)] text-sm font-mono">
                        {deity.coordinates?.lat ? `${deity.coordinates.lat.toFixed(4)}, ${deity.coordinates.lng.toFixed(4)}` : 'None'}
                      </td>
                      <td className="p-4 text-right">
                        <a 
                          href={`/deity/${deity.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--accent-color)] hover:underline text-xs font-semibold"
                        >
                          View Live Page
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Custom Side-by-Side Review and Edit Modal */}
        <Modal 
          isOpen={!!selectedSubmission && !isRejectModalOpen} 
          onClose={() => { setSelectedSubmission(null); setEditData(null); }}
          title="Sacred Moderation Review Workspace"
        >
          {editData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* Left Side: Original Raw Submission Preview */}
                <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[var(--accent-color)] font-bold block mb-2">Submitted Payload Preview</span>
                    <h4 className="text-xl font-serif text-[var(--text-primary)] mb-2">{selectedSubmission.name}</h4>
                    <p className="text-xs text-[var(--accent-color)] font-bold mb-4">{selectedSubmission.district} • {selectedSubmission.village}</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-h-48 overflow-y-auto pr-2 bg-[var(--bg-secondary)]/50 p-3 rounded border border-[var(--border-color)] font-sans whitespace-pre-wrap">
                      {selectedSubmission.description}
                    </p>
                  </div>
                  
                  {/* Images render if present */}
                  {selectedSubmission.images && selectedSubmission.images.length > 0 && (
                    <div className="mt-4 border-t border-[var(--border-color)] pt-4">
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">Attached Materials</span>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedSubmission.images.map((img, i) => (
                          <img key={i} src={img} alt="Submission" className="w-16 h-16 rounded object-cover border border-[var(--border-color)]" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Interactive Editing Inputs */}
                <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-4">
                  <span className="text-[9px] uppercase tracking-wider text-[var(--accent-color)] font-bold block">Live Editor Workspace</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Deity Name</label>
                      <input 
                        type="text" 
                        value={editData.name || ''}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none text-sm font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">District</label>
                      <input 
                        type="text" 
                        value={editData.district || ''}
                        onChange={(e) => setEditData({...editData, district: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none text-sm font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Village / Region</label>
                      <input 
                        type="text" 
                        value={editData.village || ''}
                        onChange={(e) => setEditData({...editData, village: e.target.value})}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none text-sm font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Coordinates (Lat / Lng)</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          step="0.0001"
                          placeholder="Lat"
                          value={editData.coordinates?.lat || ''}
                          onChange={(e) => setEditData({
                            ...editData, 
                            coordinates: { ...editData.coordinates, lat: parseFloat(e.target.value) || null }
                          })}
                          className="w-1/2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none text-xs font-mono"
                        />
                        <input 
                          type="number" 
                          step="0.0001"
                          placeholder="Lng"
                          value={editData.coordinates?.lng || ''}
                          onChange={(e) => setEditData({
                            ...editData, 
                            coordinates: { ...editData.coordinates, lng: parseFloat(e.target.value) || null }
                          })}
                          className="w-1/2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Sacred Lore Description</label>
                    <textarea 
                      rows={5}
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none resize-y text-xs font-sans"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                <button 
                  onClick={() => { setSelectedSubmission(null); setEditData(null); }}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitApproval}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium shadow-sm text-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Edits & Approve
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reject Modal */}
        <Modal 
          isOpen={isRejectModalOpen} 
          onClose={() => { setIsRejectModalOpen(false); setSelectedSubmission(null); }}
          title="Reject Submission"
        >
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Rejecting submission for: <strong className="text-[var(--text-primary)]">{selectedSubmission?.name}</strong>
            </p>
            
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Reason for Rejection (Optional)</label>
              <textarea 
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete information, incorrect district..."
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:border-red-500 outline-none resize-y text-sm font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
              <button 
                onClick={() => { setIsRejectModalOpen(false); setSelectedSubmission(null); }}
                className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium shadow-sm text-sm cursor-pointer"
              >
                <X className="w-4 h-4" /> Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}
