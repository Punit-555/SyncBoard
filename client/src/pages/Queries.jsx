import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import {
  getContactQueries,
  updateQueryStatus,
  replyToQuery,
  deleteContactQuery,
} from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';

const statusStyles = {
  open: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  read: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  replied: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

const sourceLabels = {
  help: 'Help Page',
  login: 'Login Screen',
  'verify-otp': 'Security Code Screen',
  landing: 'Landing Page',
};

const Queries = () => {
  const { showSuccess, showError } = useSnackbar();
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadQueries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getContactQueries();
      if (res.success) {
        setQueries(res.data || []);
      } else {
        showError('Failed to load queries');
      }
    } catch (err) {
      showError(err.message || 'Failed to load queries');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  const handleMarkRead = async (query) => {
    if (query.status !== 'open') return;
    try {
      await updateQueryStatus(query.id, 'read');
      setQueries((prev) =>
        prev.map((q) => (q.id === query.id ? { ...q, status: 'read' } : q))
      );
    } catch (err) {
      console.error('Failed to mark query as read', err);
    }
  };

  const openReplyModal = (query) => {
    setSelectedQuery(query);
    setReplyMessage('');
    setIsReplyModalOpen(true);
    handleMarkRead(query);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    try {
      setIsReplying(true);
      const res = await replyToQuery(selectedQuery.id, replyMessage);
      if (res.success) {
        showSuccess(res.message || 'Reply sent');
        setIsReplyModalOpen(false);
        setSelectedQuery(null);
        loadQueries();
      } else {
        showError(res.message || 'Failed to send reply');
      }
    } catch (err) {
      showError(err.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const confirmDelete = async () => {
    if (!queryToDelete) return;
    try {
      setIsDeleting(true);
      await deleteContactQuery(queryToDelete.id);
      showSuccess('Query deleted');
      setQueryToDelete(null);
      loadQueries();
    } catch (err) {
      showError(err.message || 'Failed to delete query');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQueries = queries.filter((q) => {
    if (filterStatus && q.status !== filterStatus) return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        q.name?.toLowerCase().includes(s) ||
        q.email?.toLowerCase().includes(s) ||
        q.subject?.toLowerCase().includes(s) ||
        q.message?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const openCount = queries.filter((q) => q.status === 'open').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Queries & Problems</h1>
          <p className="text-gray-500 text-sm mt-1">
            {openCount > 0
              ? `${openCount} open ${openCount === 1 ? 'query' : 'queries'} awaiting response`
              : 'All queries handled 🎉'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              label="Search"
              name="querySearch"
              placeholder="Search name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              label="Filter by Status"
              name="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'open', label: 'Open' },
                { value: 'read', label: 'Read' },
                { value: 'replied', label: 'Replied' },
              ]}
            />
          </div>
        </div>
      </div>

      {filteredQueries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <i className="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500">No queries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              className={`bg-white rounded-xl border p-4 md:p-5 transition-all hover:shadow-md ${
                query.status === 'open' ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-800">{query.subject}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[query.status] || statusStyles.open}`}>
                      {query.status}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {sourceLabels[query.source] || query.source}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{query.message}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span><i className="fas fa-user mr-1"></i>{query.name}</span>
                    <a href={`mailto:${query.email}`} className="text-[#4361ee] hover:underline">
                      <i className="fas fa-envelope mr-1"></i>{query.email}
                    </a>
                    <span><i className="far fa-clock mr-1"></i>{new Date(query.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {query.status === 'open' && (
                    <button
                      onClick={() => handleMarkRead(query)}
                      className="text-xs px-3 py-1.5 rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                      title="Mark as read"
                    >
                      <i className="fas fa-envelope-open mr-1"></i>
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => openReplyModal(query)}
                    className="text-xs px-3 py-1.5 rounded-lg text-white bg-[#4361ee] hover:bg-[#3f37c9] transition-colors"
                  >
                    <i className="fas fa-reply mr-1"></i>
                    Reply
                  </button>
                  <button
                    onClick={() => setQueryToDelete(query)}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    title="Delete query"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedQuery(null);
        }}
        title={`Reply to ${selectedQuery?.name || ''}`}
        modalClassName="max-w-2xl"
      >
        {selectedQuery && (
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-700 mb-1">{selectedQuery.subject}</p>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedQuery.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                From {selectedQuery.name} ({selectedQuery.email})
              </p>
            </div>

            <Textarea
              label="Your Reply"
              name="replyMessage"
              rows={5}
              placeholder="Write your response... it will be emailed to the user."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              required
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsReplyModalOpen(false);
                  setSelectedQuery(null);
                }}
                disabled={isReplying}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isReplying} disabled={isReplying}>
                <i className="fas fa-paper-plane mr-2"></i>
                Send Reply Email
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!queryToDelete}
        onClose={() => setQueryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Query"
        message={`Delete the query "${queryToDelete?.subject}" from ${queryToDelete?.name}? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default Queries;
