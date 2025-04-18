

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
    } else if(this.todos.some(todo => todo.task.toLowerCase() === task.toLowerCase())) {
      return false; // Säkerställa att inte skall finnas något dublett
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
let removeAllBtn = document.getElementById('remove-all-btn') as HTMLInputElement;
let tableBody = document.querySelector('#toDoTable tbody') as HTMLTableCaptionElement;

// En töm klass
let newTodo = new TodoList();
// Töm nummer-array
let indexes: number[] = [];


// Eventlyssnare
addBtn.addEventListener('click', getNewTodo);
removeAllBtn.addEventListener('click', removeAll);
checkBtn.addEventListener('click', markAsDone);
window.onload = init;

// Funktion för sidans start/omladdning
function init() {
  //localStorage.clear();
  addNewTodo(newTodo);
}

// Funktion för att skriva ut inmatning i tabellen
function addNewTodo(newTodoList: TodoList): void {
  
  
  tableBody.innerHTML = '';

  // Loopa genom arrayen
  newTodoList.todos.forEach(newTodo => {

    // Tabellrad
    let tableRow: HTMLTableRowElement = document.createElement('tr');

    // Uppgift-input
    let taskData: HTMLTableCellElement = document.createElement('td');
    taskData.textContent = newTodo.task;
    
    // Ta bort den påklickade uppgiften
    taskData.addEventListener('click', () => {
      tableBody.removeChild(tableRow);
      let index = newTodoList.todos.findIndex(row => row.task === taskData.textContent);
      newTodoList.todos.splice(index, 1);
      newTodoList.saveToLocalStorage();
      
    });

    // Uppgift-prioritet
    let priorityData: HTMLTableCellElement = document.createElement('td');
    priorityData.textContent = String(newTodo.priority);
    
    // Uppgift-status
    let statusData: HTMLTableCellElement = document.createElement('td');
    if(newTodo.completed === false) {
      statusData.textContent = 'Ej klar';
      statusData.style.backgroundColor = 'lightcoral';
    } else {
      statusData.textContent = 'Klar';
      statusData.style.backgroundColor = 'lightgreen';
    }

    let checkData: HTMLTableCellElement = document.createElement('td');
    let checkBox: HTMLInputElement = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.addEventListener('change', () => {
      
      let index = newTodoList.todos.findIndex(row => row.task === taskData.textContent);
      if(checkBox.checked) {

        indexes.push(index);
        
      } else {

        let indexPosition = indexes.findIndex(position => position === index);
        indexes.splice(indexPosition, 1);
      
      }
      // console.log(indexes);
      // Spara index arrayen till localstorage
      localStorage.setItem('indexes', JSON.stringify(indexes));
    });
    checkData.appendChild(checkBox);

    
    tableRow.appendChild(taskData);
    tableRow.appendChild(priorityData);
    tableRow.appendChild(statusData);
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

// Ändra status från ej klarade till klarade
function markAsDone() {
  // Hämta tillbaka sparade arrayen
  indexes = JSON.parse(localStorage.getItem('indexes') || '[]');
  
 
  // Loopa genom arrayen för att markera klarade uppgfiter
  indexes.forEach(index => {
    newTodo.markTodoCompleted(index);
  });
  
  // Anropa funktionen
  addNewTodo(newTodo);

  localStorage.removeItem('indexes');
}

// Radera alla
function removeAll() {
  tableBody.innerHTML = '';

  // Rensa localstorage
  localStorage.clear();
}