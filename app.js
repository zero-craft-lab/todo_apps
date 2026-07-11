const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const id = Date.now();

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${id}`;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
  });

  const label = document.createElement('label');
  label.htmlFor = `todo-${id}`;
  label.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', '削除');
  deleteBtn.addEventListener('click', () => li.remove());

  li.append(checkbox, label, deleteBtn);
  list.appendChild(li);

  input.value = '';
  input.focus();
}

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
