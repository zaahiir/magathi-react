import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogList from '../components/blog/BlogList';
import BlogDetail from '../components/blog/BlogDetail';

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/:slug" element={<BlogDetail />} />
      </Routes>
    </div>
  );
};

export default Blog;