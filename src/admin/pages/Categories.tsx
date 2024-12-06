import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash, ChevronDown, ChevronRight } from 'lucide-react';
import { categoryService } from '../../lib/services/categories';
import { CategoryForm } from '../components/forms/CategoryForm';
import type { Category } from '../../types/product';

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Partial<Category> | undefined>();
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      const organizedCategories = organizeCategories(data);
      setCategories(organizedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeCategories = (flatCategories: Category[]): CategoryWithChildren[] => {
    const categoryMap = new Map<string, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: Create all category objects with their basic info
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: Organize into hierarchy
    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(category);
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const handleAdd = () => {
    setSelectedCategory(undefined);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(id);
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSubmit = async (data: Partial<Category>) => {
    if (!data.name || !data.status) {
      console.error('Required fields missing');
      return;
    }

    const categoryData = {
      name: data.name,
      description: data.description || '',
      image: data.image || '',
      status: data.status,
      parent_id: data.parent_id
    };

    try {
      if (selectedCategory?.id) {
        await categoryService.updateCategory(selectedCategory.id, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
      setShowForm(false);
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategory = (category: CategoryWithChildren, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <li key={category.id}>
        <div 
          className={`px-6 py-4 ${level > 0 ? 'ml-8 border-l border-gray-200' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
              )}
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-12 w-12 object-cover rounded-md mr-4"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <ul className="divide-y divide-gray-200">
            {category.children.map(child => renderCategory(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.map(category => renderCategory(category))}
        </ul>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <CategoryForm
              category={selectedCategory}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 