

// Todo-interfacet
interface Todo {
  task: string;
  completed: boolean;
  priority: number;
};

// Todolist-klass
class TodoList {

  // töm array
  todos: Todo[]= [];

  // Lägg till en ny uppgift
  addTodo(task: string, priority: number): boolean {
    if(!task || priority < 1 || priority > 3) {
      return false;
    } else {
      let newTodo: Todo = {
        task, 
        completed: false,
        priority
      }
      this.todos.push(newTodo);
      this.saveToLocalStorage();
      return true;
    }
  };

  // Markera den avklarad
  markTodoCompleted(todoIndex: number): void {
    this.todos[todoIndex].completed = true;
    this.saveToLocalStorage();
  };

  // Hämta alla tillagda uppgifter
  getTodos(): Todo[] {
    return this.todos;
  };

  // Spara till localstorage
  saveToLocalStorage(): void {
    localStorage.removeItem('Todos');
    localStorage.setItem('Todos', JSON.stringify(this.todos));
  };

  // Ladda från localstorage
  loadFromLocalStorage(): void {
    let savedTodos = JSON.parse(localStorage.getItem('Todos') || '[]');
    if(savedTodos) {
      this.todos = savedTodos;
    }
  }
  
  // Skapa konstruktör
  constructor() {
    this.loadFromLocalStorage();
  }
}

// Variabler för formulärfält och tabell-element
let taskEl = document.getElementById('task') as HTMLInputElement;
let priorityEl = document.getElementById('priority') as HTMLSelectElement;
let addBtn = document.getElementById('add-btn') as HTMLInputElement;
let checkBtn = document.getElementById('check-btn') as HTMLInputElement;
let tableBody = document.querySelector('#toDoTable tbody') as HTMLTableCaptionElement;

// En töm klass
let newTodo = new TodoList();

// Eventlyssnare
addBtn.addEventListener('click', getNewTodo);
window.onload = init;

// Funktion för sidans start/omladdning
function init() {
  //localStorage.clear();
  addNewTodo(newTodo);
}

// Funktion för att skriva ut inmatning i tabellen
function addNewTodo(newTodoList: TodoList): void {
  
  
  tableBody.innerHTML = '';

  newTodoList.todos.forEach(newTodo => {
    let tableRow: HTMLTableRowElement = document.createElement('tr');
    let taskData: HTMLTableCellElement = document.createElement('td');
    taskData.textContent = newTodo.task;

    let priorityData: HTMLTableCellElement = document.createElement('td');
    priorityData.textContent = String(newTodo.priority);

    let checkData: HTMLTableCellElement = document.createElement('td');
    let checkBox: HTMLInputElement = document.createElement('input');
    checkBox.type = 'checkbox';
    checkData.appendChild(checkBox);

    
    tableRow.appendChild(taskData);
    tableRow.appendChild(priorityData);
    tableRow.appendChild(checkBox);
    tableBody.appendChild(tableRow);
  });

  taskEl.value = '';
  priorityEl.value = '';
}

// Funktion för mata in data och skriva ut dem i tabellen
function getNewTodo() {
  newTodo.addTodo(taskEl.value, Number(priorityEl.value));

  addNewTodo(newTodo);
}