import React, { useState } from 'react';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import BlogPreviewModal from './BlogPreviewModal';

const AdminBlogManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);

  const handleAdd = () => {
    setSelectedBlog(null);
    setCurrentView('add');
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setCurrentView('edit');
  };

  const handleView = (blog) => {
    setPreviewBlog(blog);
  };

  const handleSave = () => {
    setCurrentView('list');
    setSelectedBlog(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedBlog(null);
  };

  const handleClosePreview = () => {
    setPreviewBlog(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <BlogList
            onAdd={handleAdd}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}
        
        {currentView === 'add' && (
          <BlogForm
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        
        {currentView === 'edit' && (
          <BlogForm
            blog={selectedBlog}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {previewBlog && (
          <BlogPreviewModal
            blog={previewBlog}
            onClose={handleClosePreview}
          />
        )}
      </div>
    </div>
  );
};

export default AdminBlogManagement;
