let todos = [
  {
    id: 0,
    title: "Putzen",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "toDo",
  },
  {
    id: 1,
    title: "nooooo",
    description: "blah",
    date: "24.05.2024",
    story: "userStory",
    category: "inProgress",
  },
];

let currentDraggedElement;

function updateHTMLBoard() {
  let toDo = todos.filter((t) => t["category"] == "toDo");//Filter array nach category toDo 

  document.getElementById("toDo").innerHTML = "";//leert element mit id toDo
  if (toDo.length === 0) {
    document.getElementById("toDo").innerHTML = "<div>No Tasks to do.</div>";//erstellt div 'No Tasks to do.'
  } else {
  for (let index = 0; index < toDo.length; index++) {
    const element = toDo[index];
    document.getElementById("toDo").innerHTML += generateTodoHTML(element);//erstellt alle Tasks mit category: toDo
  }}

  let inProgress = todos.filter((t) => t["category"] == "inProgress"); //Filter Array nach category: inProgress

  document.getElementById("inProgress").innerHTML = "";//leert element mit id inProgress
  if (inProgress.length === 0) {
    document.getElementById("inProgress").innerHTML = "<div>No Tasks in Progress.</div>";//erstellt div 'No Tasks in Progress.'
  } else {

  for (let index = 0; index < inProgress.length; index++) {
    const element = inProgress[index];
    document.getElementById("inProgress").innerHTML +=//erstellt alle Tasks mit category: inProgress
      generateTodoHTML(element);
  }}

  let awaitFeedback = todos.filter((t) => t["category"] == "awaitFeedback");//Filter Array nach category: awaitFeedback

  document.getElementById("awaitFeedback").innerHTML = "";//leert element mit id awaitFeedback
  if (awaitFeedback.length === 0) {
    document.getElementById("awaitFeedback").innerHTML = "<div>No Tasks await Feedback.</div>";//erstellt div 'No Tasks await Feedback.'
  } else {
  for (let index = 0; index < awaitFeedback.length; index++) {
    const element = awaitFeedback[index];
    document.getElementById("awaitFeedback").innerHTML +=//erstellt alle Tasks mit category: awaitFeedback
      generateTodoHTML(element);
  }}

  let done = todos.filter((t) => t["category"] == "done");//Filter Array nach category: done

  document.getElementById("done").innerHTML = "";//leert element mit id done
  if (done.length === 0) {
    document.getElementById("done").innerHTML = "<div>No Tasks done.</div>";//erstellt div 'No Tasks done.'
  } else {
  for (let index = 0; index < done.length; index++) {
    const element = done[index];
    document.getElementById("done").innerHTML += generateTodoHTML(element);//erstellt alle Tasks mit category: done
  }
}}

function generateTodoHTML(element) {//erstellt element entsprechend category
  return /*html*/ `
      <div draggable="true" ondragstart="startDragging(${element["id"]})"> 
      <div>${element["story"]}</div>
      <h4>${element["title"]}</h4>
      <div>${element["description"]}</div>
      <div>${element["date"]}</div>
      </div>
  `;
}

function startDragging(id) {
  currentDraggedElement = id;//saves id from dragged element
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;//change category of element
  updateHTMLBoard();//update Board 
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");//add class on element by dragover
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");// remove class on element by dragleave
}

function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();//eingabe des inputfield speichern
  
  let filteredTodos = todos.filter(todo =>//erstellt neues array filterdTodos
    (todo.title.toLowerCase().includes(search) || todo.description.toLowerCase().includes(search)) &&// filtert FilterdTodos nach 'title' and 'description'
    (todo.category === "toDo" || todo.category === "inProgress" || todo.category === "awaitFeedback" || todo.category === "done")//filtert filredTodos nach 'category'
  );

  displayFilteredTodos(filteredTodos);//ruft displayFilteredTodos() auf
}

function displayFilteredTodos(filteredTodos) {
  document.getElementById("toDo").innerHTML = "";//leert element mit id 'toDo'
  document.getElementById("inProgress").innerHTML = "";//leert element mit id 'inProgress'
  document.getElementById("awaitFeedback").innerHTML = "";//leert element mit id 'awaitFeedback'
  document.getElementById("done").innerHTML = "";//leert element mit id 'done'

  filteredTodos.forEach(todo => {//erstellt für filteredtodos nach category neues HTML
    if (todo.category === "toDo") {
      document.getElementById("toDo").innerHTML += generateTodoHTML(todo);//erstellt in element 'toDo' für category 'toDo' neues Html
    } else if (todo.category === "inProgress") {
      document.getElementById("inProgress").innerHTML += generateTodoHTML(todo);//erstellt in element 'inProgress' für category 'inPrgress' neues Html
    } else if (todo.category === "awaitFeedback") {
      document.getElementById("awaitFeedback").innerHTML += generateTodoHTML(todo);//erstellt in element 'awaitFeedback' für category 'awaitFeedback' neues Html
    } else if (todo.category === "done") {
      document.getElementById("done").innerHTML += generateTodoHTML(todo);//erstellt in element 'done' für category 'done' neues Html
    }
  });
}  

function showaddTaskBoard(){
  let addTask = document.getElementById('addTask');//get element with id 'addTask'
  addTask.classList.remove('d-none');//remove class d-none
  addTask.classList.add('addTask');//add class 'addTask'
  creatTask();
}

function addTaskBoard(){
  //addtask.html einbinden??
}

function openAddTaskDialog() {
  // Erstellen Sie das Dialogfenster und fügen Sie die AddTask-Form hinzu
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('dialog-content');
  dialogContent.innerHTML = renderAddTaskForm();

  // Fügen Sie das Dialogfenster zum Body hinzu
  document.body.appendChild(dialogContent);

  // Entfernen Sie das Padding für das Formular im Dialogfenster
  const addTaskForm = dialogContent.querySelector('#addTaskForm');
  addTaskForm.style.paddingLeft = '0';

  // Entfernen Sie das Padding-top für das h1-Element im Dialogfenster
  const addTaskHeading = dialogContent.querySelector('h1');
  addTaskHeading.style.paddingTop = '0';

  // Wenn ein Schließen-Button benötigt wird, fügen Sie ihn hier hinzu und definieren Sie die Logik, um das Dialogfenster zu schließen
}

function renderAddTaskForm() {
  return `
      <div class="dialog-content">
          <form id="addTaskForm">
              <!-- Hier die Inhalte der AddTask-Form einfügen -->
              <h1>Add Task</h1>

              <div class="main-addTask">
                  <div class="sections-addTask">
                      <!-- Title -->
                      <section class="input-parts-addTask">
                          <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
                          <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask"/>
                      </section>

                      <!-- Description -->
                      <section class="padding-description">
                          <div class="pd-bottom"><span>Description</span></div>
                          <textarea name="description" id="" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask"></textarea>
                      </section>

                      <!-- Assigend To -->
                      <section class="padding-description">
                          <div class="pd-bottom"><label>Assigned to</label></div>
                          <div class="input-assignedTo border-input-addtask">
                              <input id="assignDropDown" type="text" name="assignTo" placeholder="Select contact to assign" class="border-none input-assignedTo"/>
                              <div class="drop-down-image-assign">
                                  <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrowdown"/> 
                              </div>              
                          </div>       
                      </section>
                  </div>

                  <!-- Seperator -->
                  <div class="seperator-addtask"><img src="assets/img/seperator_AddTask.svg" alt="seperator"/></div>

                  <!-- Right Part of Add Task -->
                  <div class="sections-addTask">
                      <!-- Due Date -->
                      <section>
                          <div class="pd-bottom"><span>Due Date<span class="required-addTask">*</span></span></div>
                          <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" required/>
                      </section>

                      <!-- Priority -->
                      <section class="padding-prio">
                          <div class="pd-bottom"><span>Prio</span></div>
                          <div class="priority">
                              <button type="button" class="button-prio" id="btnPrioUrgent" onclick="changePriorityColor('urgent')">Urgent
                                  <img src="assets/img/urgent_red_AddTask.svg" alt="urgent_red_AddTask"/>
                              </button>                    
                              <button type="button" class="button-prio" id="btnPrioMedium" onclick="changePriorityColor('medium')">Medium
                                  <img src="assets/img/medium_orange_AddTask.svg" alt="medium_orange_AddTask"/>
                              </button>                    
                              <button type="button" class="button-prio" id="btnPrioLow" onclick="changePriorityColor('low')">Low
                                  <img src="assets/img/low_green_AddTask.svg" alt="low_green_AddTask"/>
                              </button>                    
                          </div>
                      </section>

                      <!-- Category -->
                      <section class="padding-category">
                          <div class="pd-bottom"><span>Category<span class="required-addTask">*</span></span></div>
                          <div class="input-assignedTo border-input-addtask" id="categoryAddTask" onclick="toggleCategoryDropdown()">
                              Select Task Category
                              <div id="categoryDropDownArrow" class="drop-down-image">
                                  <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrow_drop_down_AddTask">
                              </div>
                          </div>
                          <div class="d-none category-menu">
                              <div class="category-option" onclick="selectCategory('User Story')">User Story</div>
                              <div class="category-option" onclick="selectCategory('Technical Story')">Technical Story</div>
                          </div>
                      </section>

                      <!-- Subtasks -->
                      <section>
                          <div class="pd-bottom"><span>Subtasks</span></div>
                          <div class="input-assignedTo border-input-addtask" id="addSubtaskMain" onfocus="handleInputFocus()">
                              <input id="addsubtask" type="text" placeholder="Add new subtasks" class="input-assignedTo border-none">
                              <div onclick="toggleSubtasks()" class="drop-down-image drop-down-subtask">
                                  <img id="plusIcon" src="assets/img/plus_addTask.svg" alt="plus_addTask">
                              </div>
                              <div id="subtasks" class="d-none add-subtasks">
                                  <img onclick="cancelSubtaskClick()" id="cancelSubtask" src="assets/img/subtask_cancel_AddTask.svg" class="subtasks" alt="subtask_cancel_AddTask">
                                  <img src="assets/img/subtask_seperator_AddTask.svg" alt="subtask_seperator_AddTask">
                                  <img onclick="saveSubtask()" id="checkSubtask" src="assets/img/subtask_check_AddTask.svg" class="subtasks" alt="subtask_check_AddTask">
                              </div>
                          </div>
                          <div id="showsubtasks" class="subtasks-list d-none"></div>
                      </section>
                  </div>
              </div>

              <!-- Footer AddTask -->
              <footer class="addtask-footer">
                  <div>
                      <span class="required-addTask">*</span>
                      This field is required
                  </div>

                  <div class="footer-btn-addTask">
                      <button onclick="clearEntries()" class="footer-btn-text-img" type="button" id="clear-btn">
                          Clear
                          <img src="assets/img/subtask_cancel_AddTask.svg" alt="subtask_cancel_AddTask">
                      </button>

                      <button class="footer-btn-text-img" type="button" id="create-btn">
                          Create Task
                          <img src="assets/img/create_hook_white_AddTask.svg" alt="create_hook_white_AddTask">
                      </button>
                  </div>
              </footer>
          </form>
      </div>
  `;
}
