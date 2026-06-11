import { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';

const COLOR_STYLES = {
  default: { card: 'bg-white border-gray-200', dot: 'bg-gray-300' },
  blue: { card: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
  green: { card: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-400' },
  amber: { card: 'bg-amber-50 border-amber-200', dot: 'bg-amber-400' },
  rose: { card: 'bg-rose-50 border-rose-200', dot: 'bg-rose-400' },
  purple: { card: 'bg-purple-50 border-purple-200', dot: 'bg-purple-400' },
};

const COLORS = Object.keys(COLOR_STYLES);

const ColorPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    {COLORS.map((c) => (
      <button
        key={c}
        type="button"
        onClick={() => onChange(c)}
        className={`w-6 h-6 rounded-full ${COLOR_STYLES[c].dot} transition-transform hover:scale-110 ${
          value === c ? 'ring-2 ring-offset-2 ring-[#4361ee]' : ''
        }`}
        title={c}
      />
    ))}
  </div>
);

const Todos = () => {
  const { showSuccess, showError } = useSnackbar();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick add
  const [quickTitle, setQuickTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  // Edit modal
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', color: 'default' });
  const [isSaving, setIsSaving] = useState(false);

  // Delete
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getTodos();
      if (res.success) {
        setTodos(res.data || []);
      } else {
        showError('Failed to load todos');
      }
    } catch (err) {
      showError(err.message || 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    try {
      setIsAdding(true);
      const res = await createTodo({ title: quickTitle });
      if (res.success) {
        setTodos((prev) => [res.data, ...prev]);
        setQuickTitle('');
      } else {
        showError(res.message || 'Failed to add todo');
      }
    } catch (err) {
      showError(err.message || 'Failed to add todo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch (err) {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: todo.completed } : t))
      );
      showError(err.message || 'Failed to update todo');
    }
  };

  const handleTogglePin = async (todo) => {
    try {
      const res = await updateTodo(todo.id, { pinned: !todo.pinned });
      if (res.success) {
        setTodos((prev) => {
          const next = prev.map((t) => (t.id === todo.id ? res.data : t));
          return [...next].sort(
            (a, b) => (b.pinned - a.pinned) || new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
      }
    } catch (err) {
      showError(err.message || 'Failed to pin todo');
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title,
      content: todo.content || '',
      color: todo.color || 'default',
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    try {
      setIsSaving(true);
      const res = await updateTodo(editingTodo.id, editForm);
      if (res.success) {
        setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? res.data : t)));
        setEditingTodo(null);
        showSuccess('Todo updated');
      } else {
        showError(res.message || 'Failed to update todo');
      }
    } catch (err) {
      showError(err.message || 'Failed to update todo');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!todoToDelete) return;
    try {
      setIsDeleting(true);
      await deleteTodo(todoToDelete.id);
      setTodos((prev) => prev.filter((t) => t.id !== todoToDelete.id));
      setTodoToDelete(null);
      showSuccess('Todo deleted');
    } catch (err) {
      showError(err.message || 'Failed to delete todo');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filter === 'active' && t.completed) return false;
      if (filter === 'completed' && !t.completed) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title?.toLowerCase().includes(q) ||
          t.content?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [todos, filter, searchQuery]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Todos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Your private notes — only you can see these.
          {todos.length > 0 && ` ${activeCount} active · ${completedCount} done.`}
        </p>
      </div>

      {/* Quick add */}
      <form
        onSubmit={handleQuickAdd}
        className="flex gap-2 mb-5 bg-white rounded-xl border border-gray-200 shadow-sm p-2 focus-within:border-[#4361ee]/40 focus-within:ring-2 focus-within:ring-[#4361ee]/10 transition-all"
      >
        <i className="fas fa-plus text-gray-300 self-center ml-2"></i>
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Add a todo... press Enter to save"
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 px-1"
          maxLength={200}
        />
        <Button type="submit" loading={isAdding} disabled={isAdding || !quickTitle.trim()}>
          Add
        </Button>
      </form>

      {/* Search + filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search todos..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#4361ee]/40 focus:ring-2 focus:ring-[#4361ee]/10 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.key
                  ? 'bg-[#4361ee] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes grid */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <i className="fas fa-sticky-note text-gray-200 text-6xl mb-4"></i>
          <p className="text-gray-500 font-medium">
            {todos.length === 0 ? 'No todos yet' : 'Nothing matches your search'}
          </p>
          {todos.length === 0 && (
            <p className="text-gray-400 text-sm mt-1">Add your first note above ✨</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTodos.map((todo) => {
            const style = COLOR_STYLES[todo.color] || COLOR_STYLES.default;
            return (
              <div
                key={todo.id}
                className={`group relative rounded-xl border p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${style.card} ${
                  todo.completed ? 'opacity-70' : ''
                }`}
              >
                {/* Pin indicator */}
                {todo.pinned && (
                  <i className="fas fa-thumbtack absolute -top-1.5 -right-1.5 text-[#4361ee] text-sm rotate-45 drop-shadow-sm"></i>
                )}

                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      todo.completed
                        ? 'bg-[#4361ee] border-[#4361ee] text-white'
                        : 'border-gray-300 hover:border-[#4361ee] bg-white'
                    }`}
                    title={todo.completed ? 'Mark as active' : 'Mark as done'}
                  >
                    {todo.completed && <i className="fas fa-check text-[9px]"></i>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-sm text-gray-800 break-words ${
                        todo.completed ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.content && (
                      <p
                        className={`text-xs text-gray-500 mt-1.5 whitespace-pre-wrap break-words ${
                          todo.completed ? 'line-through' : ''
                        }`}
                      >
                        {todo.content}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-3">
                      {new Date(todo.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePin(todo)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      todo.pinned
                        ? 'text-[#4361ee] bg-[#4361ee]/10'
                        : 'text-gray-400 hover:text-[#4361ee] hover:bg-white/80'
                    }`}
                    title={todo.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    <i className="fas fa-thumbtack"></i>
                  </button>
                  <button
                    onClick={() => openEditModal(todo)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-[#4361ee] hover:bg-white/80 transition-colors"
                    title="Edit"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    onClick={() => setTodoToDelete(todo)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-red-500 hover:bg-white/80 transition-colors"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="Edit Todo"
        modalClassName="max-w-2xl"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            placeholder="Todo title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
          />
          <Textarea
            label="Notes (optional)"
            name="content"
            rows={4}
            placeholder="Add more details..."
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <ColorPicker
              value={editForm.color}
              onChange={(color) => setEditForm({ ...editForm, color })}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingTodo(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSaving} disabled={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!todoToDelete}
        onClose={() => setTodoToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Todo"
        message={`Delete "${todoToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default Todos;
