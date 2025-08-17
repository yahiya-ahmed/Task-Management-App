import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function TaskDetailModal({
  show,
  onClose,
  task,
  updateTaskDetails
}) {
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setNotes(task.notes || '');
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const handleAddSubtask = () => {
    if (newSubtask.trim() === '') return;
    setSubtasks([...subtasks, { name: newSubtask.trim(), is_complete: false }]);
    setNewSubtask('');
  };

  const handleToggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].is_complete = !updated[index].is_complete;
    setSubtasks(updated);
  };

  const handleEditSubtask = (index, newName) => {
    const updated = [...subtasks];
    updated[index].name = newName;
    setSubtasks(updated);
  };

  const handleDeleteSubtask = (index) => {
    const updated = subtasks.filter((_, i) => i !== index);
    setSubtasks(updated);
  };

  const handleSave = () => {
    updateTaskDetails(task.id, notes, subtasks);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <hr />

        <Form.Label>Subtasks</Form.Label>
        <div className="mb-3">
          {subtasks.map((sub, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <Form.Check
                type="checkbox"
                checked={sub.is_complete}
                onChange={() => handleToggleSubtask(i)}
                className="me-2"
              />
              <Form.Control
                value={sub.name}
                onChange={(e) => handleEditSubtask(i, e.target.value)}
                className="me-2"
              />
              <Button variant="danger" size="sm" onClick={() => handleDeleteSubtask(i)}>
                <i className="bi bi-trash" />
              </Button>
            </div>
          ))}
          <div className="d-flex align-items-center">
            <Form.Control
              placeholder="New subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="me-2"
            />
            <Button variant="secondary" size="sm" onClick={handleAddSubtask}>
              Add
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}