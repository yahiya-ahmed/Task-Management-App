import React from 'react';

export default function TaskForm({
  formData,
  customCategory,
  categoryOptions,
  handleChange,
  handleCustomCategoryChange,
  handleSubmit,
  editingTaskId,
  handleCancelEdit
}) {
  return (
    <form onSubmit={handleSubmit}>

      {/* Title */}
      <div className="mb-2">
        <label htmlFor="title" className="form-label">
          Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Due Date */}
      <div className="mb-2">
        <label htmlFor="due_date" className="form-label">
          Due Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          className="form-control"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category Dropdown */}
      <div className="mb-2">
        <label htmlFor="category" className="form-label">
          Category <span className="text-danger">*</span>
        </label>
        <select
          id="category"
          name="category"
          className="form-select"
          value={formData.category === "Other" ? "Other" : formData.category}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected === "Other") {
              handleChange({ target: { name: "category", value: "Other" } });
            } else {
              handleChange({ target: { name: "category", value: selected } });
              handleCustomCategoryChange('');
            }
          }}
          required
        >
          <option value="">Select category</option>
          {categoryOptions.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Custom Category Input */}
      {formData.category === "Other" && (
        <div className="mb-2">
          <label htmlFor="customCategory" className="form-label">
            Custom Category <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="customCategory"
            name="customCategory"
            className="form-control"
            value={customCategory}
            onChange={(e) => handleCustomCategoryChange(e.target.value)}
            required
          />
        </div>
      )}

      {/* Reminder Time */}
      <div className="mb-2">
        <label htmlFor="reminder_time" className="form-label">Reminder Time (optional)</label>
        <input
          type="datetime-local"
          id="reminder_time"
          name="reminder_time"
          className="form-control"
          value={formData.reminder_time}
          onChange={handleChange}
        />
      </div>

      {/* Priority */}
      <div className="mb-2">
        <label htmlFor="priority" className="form-label">Priority (optional)</label>
        <select
          id="priority"
          name="priority"
          className="form-select"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="d-flex gap-2">
        {/* Switch between Add and Update */}
        <button className="btn btn-primary" type="submit">
          {editingTaskId ? 'Update Task' : 'Add Task'}
        </button>

        {editingTaskId && (
          <button
            type="button"
            className=" btn btn-secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
      
    </form>
  )
}