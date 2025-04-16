

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
    localStorage.setItem('Todos', JSON.stringify(this.todos));
    console.log(`${this.todos} är sparad till Localstorage`);
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