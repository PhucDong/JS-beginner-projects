// Select DOM
const todoList = document.querySelector(".task-list");
const filterOption = document.querySelector("#filter");
const form = document.querySelector(".form");
const taskInput = document.querySelector("#newItem");

// Mark done
function markDone(liContent) {
  liContent.classList.toggle("done");
}

function removeTask(todoLi) {
  todoLi.classList.add("fall");
  todoLi.addEventListener("transitionend", () => todoLi.remove());
}

todoList.addEventListener("click", (e) => {
  const element = e.target;
  console.log(e.target);

  if (element.classList[1] === "btn-action-done") {
    markDone(element.parentNode.parentNode);
  } else if (element.classList[1] === "fa-xmark") {
    removeTask(element.parentNode.parentNode.parentNode);
  }
});

// Filter tasks
function filterTasks(hideDoneTasks) {
  todoList.querySelectorAll("li").forEach((todoLi) => {
    if (todoLi.classList.contains("done")) {
      todoLi.style.display = hideDoneTasks ? "none" : "flex";
    }
  });
}

filterOption.addEventListener("click", (e) => {
  filterTasks(e.target.checked);
});

// Add a new task
function addTask(taskLabel) {
  const todoLi = document.createElement("li");
  const labelSpan = document.createElement("span");

  labelSpan.className = "label";
  labelSpan.textContent = taskLabel;
  todoLi.appendChild(labelSpan);

  const divActions = document.createElement("div");
  divActions.className = "actions";
  const documentFragment = document.createRange().createContextualFragment(`
    <input type="checkbox" class="btn-action btn-action-done" />
    <button class="btn-action btn-action-delete">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `);
  divActions.appendChild(documentFragment);

  todoLi.appendChild(divActions);

  todoList.appendChild(todoLi);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskLabel = taskInput.value.trim();

  if (taskLabel) {
    addTask(taskLabel);
    taskInput.value = "";
  }
});
