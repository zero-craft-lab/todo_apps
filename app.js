const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

function saveTodos() {
  const items = [...list.querySelectorAll('.todo-item')].map(li => ({
    id: li.dataset.id,
    text: li.querySelector('label').textContent,
    done: li.classList.contains('done'),
    dueDate: li.dataset.dueDate || '',
    memo: li.querySelector('.memo-text')?.value || '',
  }));
  localStorage.setItem('todos', JSON.stringify(items));
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const [year, month, day] = dueDate.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month - 1, day) < today;
}

function formatDate(dueDate) {
  const [, month, day] = dueDate.split('-');
  return `${parseInt(month)}/${parseInt(day)}`;
}

function createTodoElement(id, text, done = false, dueDate = '', memo = '') {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (done) li.classList.add('done');
  li.dataset.id = id;
  if (dueDate) li.dataset.dueDate = dueDate;

  let dueDateSpan = null;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${id}`;
  checkbox.checked = done;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('done', checkbox.checked);
    if (dueDateSpan) {
      dueDateSpan.classList.toggle('overdue', !checkbox.checked && isOverdue(dueDate));
    }
    saveTodos();
  });

  const label = document.createElement('label');
  label.htmlFor = `todo-${id}`;
  label.textContent = text;
  label.addEventListener('click', (e) => {
    e.preventDefault();
    memoArea.classList.toggle('open');
  });

  if (dueDate) {
    dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    if (!done && isOverdue(dueDate)) dueDateSpan.classList.add('overdue');
    dueDateSpan.textContent = formatDate(dueDate);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', '削除');
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTodos();
  });

  const memoArea = document.createElement('div');
  memoArea.className = 'memo-area';

  const memoText = document.createElement('textarea');
  memoText.className = 'memo-text';
  memoText.placeholder = 'メモを入力...';
  memoText.value = memo;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'memo-save-btn';
  saveBtn.textContent = '保存';
  saveBtn.addEventListener('click', () => {
    saveTodos();
    memoArea.classList.remove('open');
  });

  memoArea.append(memoText, saveBtn);

  li.append(checkbox, label);
  if (dueDateSpan) li.append(dueDateSpan);
  li.append(deleteBtn, memoArea);
  return li;
}

function addTodo() {
  const text = input.value.trim();
  if (!text || !dueDateInput.value) return;

  const id = Date.now();
  list.appendChild(createTodoElement(id, text, false, dueDateInput.value));
  saveTodos();

  input.value = '';
  dueDateInput.value = '';
  input.focus();
}

function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (!saved) return;
  JSON.parse(saved).forEach(({ id, text, done, dueDate, memo }) => {
    list.appendChild(createTodoElement(id, text, done, dueDate || '', memo || ''));
  });
}

loadTodos();

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
