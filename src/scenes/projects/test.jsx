<div className="add-issue">
      <form>

      <label>
          Title

          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            placeholder="Title" />

        </label>

        <label>
          Description
          <input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            type="text" 
            placeholder="Description of Project" />
        </label>

        <label>
          Project Manager
          <select name="assignTo" onChange={(e) => setProjectManager(e.target.value)}>
          {Array.isArray(users) && users.filter(function (user) {
            return user.role === "Project Manager"
          }).map(user => (
              <option value={user.full_name}>{user.full_name}</option>
            ))}
          </select>
        </label>

        <label>
          Assign to
          <div>
              <Multiselect
              isObject={false}
              options={devs}
              />
          </div>
        </label>
        
        <label>
          Priority
          <select name="priority" onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Extra-High">Extra-High</option>
          </select>
        </label>

        <button type="submit" onClick={handleSubmit}>Add</button>
      </form>
    </div>