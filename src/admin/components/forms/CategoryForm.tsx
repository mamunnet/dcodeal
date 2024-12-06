import { useState, useEffect } from 'react';
import { ImageUpload } from '../ui/ImageUpload';
import { categoryService } from '../../../lib/services/categories';
import type { Category } from '../../../types/product';

interface CategoryFormProps {
  category?: Partial<Category>;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: '',
    status: 'active',
    parent_id: '',
    ...category,
  });
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadExistingCategories();
  }, []);

  const loadExistingCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      // Filter out the current category (if editing) and its children
      const availableCategories = categories.filter(cat => 
        !category?.id || // If creating new, show all top-level
        (cat.id !== category.id && cat.parent_id !== category.id) // If editing, exclude self and children
      );
      setExistingCategories(availableCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.status) {
      return;
    }
    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        status: formData.status,
        parent_id: formData.parent_id || undefined
      });
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Parent Category</label>
        <select
          value={formData.parent_id || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            parent_id: e.target.value || undefined 
          }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">None (Top Level Category)</option>
          {existingCategories
            .filter(cat => !cat.parent_id) // Only show top-level categories as parents
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={formData.status || 'active'}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            status: e.target.value as 'active' | 'inactive' 
          }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <ImageUpload
          currentImage={formData.image}
          onImageSelected={handleImageUpload}
          folder="categories"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
} 