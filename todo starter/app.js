const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const workList = document.getElementById('workList');
const personalList = document.getElementById('personalList');
const urgentList = document.getElementById('urgentList');
let currentCategory = 'work';  // Default category

let editTodo = null;

// Function to switch categories
const switchCategory = (category) => {
    currentCategory = category;
};

// Function to add todo
const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (inputText.length <= 0) {
        alert("You must write something in your to-do");
        return false;
    }

    if (addBtn.value === "Edit") {
        editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        // Creating li tag for todo
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);

        // Creating Edit button
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Creating Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        // Append the new todo to the appropriate list
        if (currentCategory === 'work') {
            workList.appendChild(li);
        } else if (currentCategory === 'personal') {
            personalList.appendChild(li);
        } else if (currentCategory === 'urgent') {
            urgentList.appendChild(li);
        }

        inputBox.value = "";
        saveLocalTodos(inputText, currentCategory);
    }
};

// Function to update (Edit/Delete) todo
const updateTodo = (e) => {
    if (e.target.innerHTML === "Remove") {
        e.target.parentElement.remove();
        deleteLocalTodos(e.target.parentElement, currentCategory);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
};

// Function to save local todo
const saveLocalTodos = (todo, category) => {
    let todos;
    if (localStorage.getItem(category) === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem(category));
    }
    todos.push(todo);
    localStorage.setItem(category, JSON.stringify(todos));
};

// Function to get local todos for all categories
const getLocalTodos = () => {
    ['work', 'personal', 'urgent'].forEach(category => {
        let todos = JSON.parse(localStorage.getItem(category)) || [];
        todos.forEach(todo => {
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.innerHTML = todo;
            li.appendChild(p);

            // Creating Edit button
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            // Creating Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            if (category === 'work') {
                workList.appendChild(li);
            } else if (category === 'personal') {
                personalList.appendChild(li);
            } else if (category === 'urgent') {
                urgentList.appendChild(li);
            }
        });
    });
};

// Function to delete local todo
const deleteLocalTodos = (todo, category) => {
    let todos = JSON.parse(localStorage.getItem(category)) || [];
    const todoText = todo.children[0].innerHTML;
    todos = todos.filter(t => t !== todoText);
    localStorage.setItem(category, JSON.stringify(todos));
};

// Function to edit local todos
const editLocalTodos = (todo) => {
    let todos = JSON.parse(localStorage.getItem(currentCategory));
    const todoIndex = todos.indexOf(todo);
    todos[todoIndex] = inputBox.value;
    localStorage.setItem(currentCategory, JSON.stringify(todos));
};

// Event Listeners
document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);

// Listeners for each category (assuming you have buttons or dropdown for category switching)
document.getElementById('workCategory').addEventListener('click', () => switchCategory('work'));
document.getElementById('personalCategory').addEventListener('click', () => switchCategory('personal'));
document.getElementById('urgentCategory').addEventListener('click', () => switchCategory('urgent'));

[workList, personalList, urgentList].forEach(list => {
    list.addEventListener('click', updateTodo);
});
