import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import TaskForm from './TaskForm';

export default function TaskModal({
  show,
  onClose,
  onSubmit,
  formData,
  handleChange,
  handleCustomCategoryChange,
  categoryOptions,
  customCategory,
  handleCancelEdit,
  editingTaskId
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    onClose(); // Close after submission
  };

  const handleCancel = () => {
    handleCancelEdit();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingTaskId ? 'Edit Task' : 'Add Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TaskForm
          formData={formData}
          handleChange={handleChange}
          customCategory={customCategory}
          handleCustomCategoryChange={handleCustomCategoryChange}
          handleSubmit={handleFormSubmit}
          handleCancelEdit={handleCancel}
          categoryOptions={categoryOptions}
          editingTaskId={editingTaskId}
        />
      </Modal.Body>
    </Modal>
  );
}