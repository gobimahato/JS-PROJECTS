const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");

let taskCount = 0;

// Display the count of tasks left to complete
const displayCount = (taskCount) => {
  const taskWord = taskCount === 1 ? "task" : "tasks";
  countValue.innerText = `${taskCount} ${taskWord}`;
};

// Load tasks from localStorage
const loadTasks = () => {
  const savedTasks = localStorage.getItem("tasksList");
  if (savedTasks) {
    tasksContainer.innerHTML = savedTasks;
    setupTaskEventListeners();
    updateTaskCount();
  }
};

// Save current tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasksList", tasksContainer.innerHTML);
};

// Count actual number of unchecked tasks
const updateTaskCount = () => {
  const allTasks = document.querySelectorAll(".task");
  const completedTasks = document.querySelectorAll(".task-check:checked");
  taskCount = allTasks.length - completedTasks.length;
  displayCount(taskCount);
};

// Set up event listeners for all task buttons and checkboxes
const setupTaskEventListeners = () => {
  // Setup delete buttons
  document.querySelectorAll(".delete").forEach((button) => {
    button.onclick = () => {
      button.parentNode.remove();
      updateTaskCount();
      saveTasks();
    };
  });

  // Setup edit buttons
  document.querySelectorAll(".edit").forEach((editBtn) => {
    editBtn.onclick = (e) => {
      let targetElement = e.target;
      if (!e.target.classList.contains("edit")) {
        targetElement = e.target.parentElement;
      }
      newTaskInput.value = targetElement.previousElementSibling?.innerText;
      targetElement.parentNode.remove();
      updateTaskCount();
      saveTasks();
    };
  });

  // Setup checkboxes
  document.querySelectorAll(".task-check").forEach((checkBox) => {
    checkBox.onchange = () => {
      checkBox.nextElementSibling.classList.toggle("completed");
      updateTaskCount();
      saveTasks();
    };
  });
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";

  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }
  const task = `
  <div class="task">
    <input type="checkbox" class="task-check">
    <span class="taskname">${taskName}</span>
    <button class="edit">
      <i class="fas fa-edit"></i>
    </button>
    <button class="delete">
      <i class="far fa-trash-alt"></i>
    </button>
  </div>
`;

  tasksContainer.insertAdjacentHTML("beforeend", task);
  setupTaskEventListeners();
  updateTaskCount();
  saveTasks();

  newTaskInput.value = "";
};

// Add task when clicking the add button
addBtn.addEventListener("click", addTask);

// Add task when pressing Enter in the input field
newTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Initialize the app when page loads
window.onload = () => {
  loadTasks();
  newTaskInput.value = "";
  newTaskInput.focus();
};
