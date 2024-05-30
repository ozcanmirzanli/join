/*Java Script für header.html & sidemenu.html*/

let submenuOpen = false;
let users = [];

async function initHeader() {
  loadUsersHead();
}

async function loadUsersHead() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
  renderUserHeader();
}

function toggleSubmenu() {
  if (!submenuOpen) {
    openSubmenu();
    submenuOpen = true;
  } else {
    closeSubmenu();
    submenuOpen = false;
  }
}

function openSubmenu() {
  document.getElementById("userHeader").style.backgroundColor =
    "rgb(225,230,236)";

  let submenu = document.getElementById("subMenu");
  submenu.classList.remove("d-none");
  submenu.classList.add("subMenu");

  submenuOpen = true;
}

function closeSubmenu() {
  document.getElementById("userHeader").style.backgroundColor =
    "rgb(255,255,255)";
  let submenu = document.getElementById("subMenu");
  submenu.classList.add("d-none");
  submenu.classList.remove("subMenu");

  submenuOpen = false;
}

/**
 * Changes the background of the clicked button and saves its ID to local storage.
 * @param {string} id - The ID of the clicked button.
 */
function changeBackground(id) {
  // Remove 'clickedSideBtn' class from all buttons
  document.getElementById("sideBtn1").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn2").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn3").classList.remove("clickedSideBtn");
  document.getElementById("sideBtn4").classList.remove("clickedSideBtn");
  // Get the clicked button and add 'clickedSideBtn' class to it
  let clickedBtn = document.getElementById(id);
  localStorage.setItem("clickedBtnId", id); // Save ID of clicked Button
  clickedBtn.classList.add("clickedSideBtn"); // Highlight clicked Button
}

function goBack() {
  window.history.back();
}

function renderUserHeader() {
  const currentUser = getCurrentUserHeader();
  if (currentUser) {
    const name = currentUser.userName;
    const initials = getInitials(name);
    const user = document.getElementById("userHeader");
    user.innerHTML = `<div class="initialsHeader">${initials}</div>`;
  } else {
    document.getElementById(
      "userHeader"
    ).innerHTML = `<div class="initialsHeader">G</div>`;
  }
}

function getCurrentUserHeader() {
  const userName = JSON.parse(sessionStorage.getItem("currentUser"));
  if (userName) {
    return userName;
  }
  return null;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}
