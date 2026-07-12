const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

function saveTodos() {
  const items = [...list.querySelectorAll('.todo-item')].map(li => ({
    id: li.dataset.id,
    text: li.querySelector('label').textContent,
    done: li.classList.contains('done'),
  }));
  localStorage.setItem('todos', JSON.stringify(items));
}

function createTodoElement(id, text, done = false) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (done) li.classList.add('done');
  li.dataset.id = id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${id}`;
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    saveTodos();
  });

  const label = document.createElement('label');
  label.htmlFor = `todo-${id}`;
  label.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', '削除');
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTodos();
  });

  li.append(checkbox, label, deleteBtn);
  return li;
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const id = Date.now();
  list.appendChild(createTodoElement(id, text));
  saveTodos();

  input.value = '';
  input.focus();
}

function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;
  JSON.parse(saved).forEach(({ id, text, done }) => {
    list.appendChild(createTodoElement(id, text, done));
  });
}

loadTodos();

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
