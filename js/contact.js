let contacts = [];
let firstLetters = [];

let colors = [
  "#FF7A00",
  "#9327FF",
  "#6E52FF",
  "#FC71FF",
  "#FFBB2B",
  "rgb(31,215,193)",
  "rgb(70,47,138)",
  "rgb(255,70,70)",
  "rgb(0,190,232)",
  "rgb(255,122,0)",
];

async function init() {
  await getContact();
  renderContacts();
}

async function getContact() {
  try {
    contacts = JSON.parse(await getItem("contact"));
  } catch (error) {
    console.info("Could not load contacts");
  }
}

function addNewContact() {
  let addContact = document.getElementById("addContact");
  addContact.classList.remove("d-none");
  addContact.classList.add("addContact");
  let addBtn = document.querySelector(".addBtn");
  addBtn.style.backgroundColor = "rgb(9,25,49)";
  addContact.innerHTML = generateAddContactHTML();
}

function generateAddContactHTML() {
  return /*html*/ `
  <section class="addContactLeft">
  <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
  <h1>AddContact</h1><h2>Tasks are better with a Team!</h2><div class="vector"></div>
  </section>
  <section class="addContactRight">
  <div class="close"><img src="./assets/img/Close.png" alt="" onclick="closeAddContact()"></div>
  <div class="inputarea">
  <img src="./assets/img/Group 13.png" alt="" class="addInitials">
  ${generateAddContactInputsHTML()}
  </div>
  ${generateAddContactButtonsHTML()}`;
}

function generateAddContactInputsHTML() {
  return /*html*/ `
  <form class="inputFields">
  <div class="input"><input type="text" placeholder="Name" id="name"><img src="./assets/img/input_name.png" alt="" class="inputImg"></div>
  <div class="input"><input type="e-mail" placeholder="E-Mail" id="mail"><img src="./assets/img/mail.png" alt="" class="inputImg"></div>
  <div class="input"><input type="number" placeholder="Telefonnummer" id="number"><img src="./assets/img/call.png" alt="" class="inputImg"></div>
  </form>`;
}

function generateAddContactButtonsHTML() {
  return /*html*/ `
  <div class="btnArea" style= "margin-top: 80px;" >
     <button class="addContactCancel" onclick="closeAddContact()">
     <p class="cancelText">Cancel</p><img src="./assets/img/Close.png" alt="" class="close">
     </button>
     <button class="addContactSave" onclick="saveContact()">
     <p class="saveText">Create Contact</p>
    <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
    </button>
  </div>
  </section> 
  `;
}

async function saveContact() {
  let contact = createContact();
  contacts.push(contact);
  await saveContacts();
  updateUI(contacts.length - 1);
  addFirstLetter(contact.name);
}

function createContact() {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let initials = getInitials(name);
  let id = contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 0;
  return { name, email: mail, number, color, initials, id };
}

async function saveContacts() {
  await setItem("contact", JSON.stringify(contacts));
}

function updateUI(index) {
  getOverview(index);
  renderContacts();
  closeAddContact();
}

function addFirstLetter(name) {
  let firstNameInitial = name.split(" ")[0].charAt(0).toUpperCase();
  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}

function closeAddContact() {
  let addContact = document.getElementById("addContact");
  addContact.classList.add("d-none");
  addContact.classList.remove("addContact");
}

function renderContacts() {
  let overview = document.getElementById("allContacts");
  overview.innerHTML = "";

  setContactIds();
  sortContacts();
  // Initialisiere ein Objekt, um die Kontakte nach dem ersten Buchstaben ihres Namens zu gruppieren
  let contactsByFirstLetter = groupContactsByFirstLetter();

  // Rufe die Buchstabenkategorien-Funktion für jeden Buchstaben auf und füge sie dem DOM hinzu
  for (let letter in contactsByFirstLetter) {
    overview.innerHTML += generateLettersCategoriesHTML(letter);
    // Rufe die Render-Funktion für die Kontakte jedes Buchstabens auf
    renderContactsByLetter(letter, contactsByFirstLetter[letter]);
  }
}

function setContactIds() {
  // Setze die ID jedes Kontakts auf den Array-Index, falls noch nicht gesetzt
  contacts.forEach((contact, index) => {
    if (!contact.hasOwnProperty("id")) {
      contact.id = index;
    }
  });
}

function sortContacts() {
  // Sortiere die Kontakte alphabetisch nach dem Namen
  contacts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function groupContactsByFirstLetter() {
  let contactsByFirstLetter = {};
  // Gruppiere die Kontakte nach dem ersten Buchstaben ihres Namens
  contacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!contactsByFirstLetter[firstLetter]) {
      contactsByFirstLetter[firstLetter] = [];
    }
    contactsByFirstLetter[firstLetter].push(contact);
  });
  return contactsByFirstLetter;
}

// Funktion zum Rendern der Kontakte für jeden Buchstaben
function renderContactsByLetter(letter, contacts) {
  let container = document.getElementById(`contactsList${letter}`);

  contacts.forEach(function (contact) {
    container.innerHTML += generateSmallContactHTML(contact);
  });
}

function generateSmallContactHTML(contact) {
  return /*html*/ `
  <div class="contactSmall" data-id="${contact.id}" onclick="getOverview(${contact.id})">
    <div class="initials" style="background-color: ${contact.color};">${contact.initials}</div>
    <div class="contactInfo">
      <div class="name">${contact.name}</div>
      <div class="mail">${contact.email}</div>
    </div>
  </div>
`;
}

function generateLettersCategoriesHTML(firstLetter) {
  return /*html*/ `
   <div id="container${firstLetter}">
      <div class="container-letter">${firstLetter}</div>
      <div class="contactsSeperator"></div>
      <div id="contactsList${firstLetter}"></div>
   </div>
   `;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
}

contacts.forEach(function (contact) {
  contact.initials = getInitials(contact.name);
});

function getOverview(contactId) {
  let contact = contacts.find((contact) => contact.id === contactId);
  displayContactDetails(contact);
  changeContactColor(contactId);
}

function displayContactDetails(contact) {
  let contactBig = document.getElementById("contactBig");
  contactBig.classList.remove("d-none");
  contactBig.innerHTML = generateContactDetailsHTML(contact);
}

// prettier-ignore
function generateContactDetailsHTML(contact) {
  return /*html*/ `
    <div class="upperArea">
      <div class="initialsBig" style="background-color: ${contact.color};">${contact.initials}</div>
      <div>
     ${generateContactNameAreaHTML(contact)}
      </div>
    </div>
    <div class="infoHead">Contact Information</div>
    <div class="contactdetails">
      ${generateContactDetailsInfo(contact)}
    </div>
  `;
}

function generateContactNameAreaHTML(contact) {
  return /*html*/ `
  <div class="nameArea">
  <div class="nameBig">${contact.name}</div>
  <div class="btnArea">
    <div class="deleteBtnContact" onclick="editContact(${contact.id})">
      <img src="./assets/img/edit.svg" alt="" class="imgEdit"/>Edit
    </div>
    <div class="deleteBtnContact" onclick="deleteContact(${contact.id})">
      <img src="./assets/img/delete.png" alt="" class="imgDelete" />Delete
    </div>
  </div>
</div>
`;
}

function generateContactDetailsInfo(contact) {
  return /*html*/ `
    <div class="contactDetailsInfo">
      <div class="mailHead">Email</div>
      <div style="background-color: background: #007CEE;" class="email">${contact.email}</div>
    </div>
    <div class="contactDetailsInfo">
      <div class="mailHead">Phone</div>
      <div>${contact.number}</div>
    </div>
  `;
}

function changeContactColor(contactId) {
  let allContacts = document.querySelectorAll(".contactSmall");
  allContacts.forEach((contact) => {
    if (contact.getAttribute("data-id") == contactId) {
      contact.classList.add("contact-list-active");
    } else {
      contact.classList.remove("contact-list-active");
    }
  });
}

function changeContactColor(contactId) {
  let allContacts = document.querySelectorAll(".contactSmall");

  allContacts.forEach((contact) => {
    if (contact.getAttribute("data-id") == contactId) {
      contact.classList.add("contact-list-active");
    } else {
      contact.classList.remove("contact-list-active");
    }
  });
}

function closeOverview() {
  document.getElementById("contactBig").classList.add("d-none");
}

async function deleteContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);
    await setItem("contact", JSON.stringify(contacts));
    await getContact();
    closeAddContact();
    closeOverview();
    renderContacts();
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function editContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    let contact = contacts[index];
    displayEditContactForm(contact);
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function displayEditContactForm(contact) {
  let addContact = document.getElementById("addContact");
  addContact.classList.remove("d-none");
  addContact.classList.add("addContact");
  addContact.innerHTML = generateEditContactHTML(contact);
  document.getElementById("badgeColor").value = contact.color;
}

function generateEditContactHTML(contact) {
  return /*html*/ `
    <section class="addContactLeft">
      <img src="./assets/img/joinLogoWhite.svg" alt="" class="logo">
      <h1>Edit Contact</h1><div class="vector"></div>
    </section>
    <section class="addContactRigth">
      <div class="close"><img src="./assets/img/Close.png" alt="" onclick="closeAddContact()"></div>
      <div class="inputarea">
        <img src="./assets/img/Group 13.png" alt="" class="addInitials">
        ${generateEditContactInputsHTML(contact)}
      </div>
      ${generateEditContactButtonsHTML(contact.id)}
    </section>`;
}

function generateEditContactInputsHTML(contact) {
  return /*html*/ `
    <div class="inputFields">
      <div class="input">
        <input type="text" placeholder="Name" id="name" value="${contact.name}">
        <img src="./assets/img/input_name.png" alt="" class="inputImg">
      </div>
      <div class="input">
        <input type="e-mail" placeholder="E-Mail" id="mail" value="${contact.email}">
        <img src="./assets/img/mail.png" alt="" class="inputImg">
      </div>
      <div class="input">
        <input type="number" placeholder="Telefonnummer" id="number" value="${contact.number}">
        <img src="./assets/img/call.png" alt="" class="inputImg">
      </div>
    </div>`;
}

function generateEditContactButtonsHTML(contactId) {
  return /*html*/ `
    <div class="btnArea" style="margin-top: 80px;">
      <button class="deleteBtnEdit" onclick="deleteContact(${contactId})">
        <p class="deleteBtnEditText">Delete</p>
      </button>
      <button class="saveBtn" onclick="saveEditedContact(${contactId})">
        <p class="saveBtnText">Save</p>
        <img src="./assets/img/check.png" alt="" style="width: 20px; height: 18px;"/>
      </button>
    </div>`;
}

async function saveEditedContact(contactId) {
  const index = findContactIndex(contactId);

  if (index !== -1) {
    updateContactDetails(index);
    await saveContactsToStorage();
    renderUpdatedContacts();
    closeAddContact();
    updateFirstLettersAfterEdit(index);
  } else {
    console.error("Contact not found with ID: ", contactId);
  }
}

function findContactIndex(contactId) {
  return contacts.findIndex((contact) => contact.id === contactId);
}

function updateContactDetails(index) {
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let number = document.getElementById("number").value;
  let color = colors[Math.floor(Math.random() * colors.length)];
  let initials = getInitials(name);

  contacts[index]["name"] = name;
  contacts[index]["email"] = mail;
  contacts[index]["number"] = number;
  contacts[index]["color"] = color;
  contacts[index]["initials"] = initials;
}

async function saveContactsToStorage() {
  await setItem("contact", JSON.stringify(contacts));
}

function renderUpdatedContacts() {
  renderContacts();
}

function updateFirstLettersAfterEdit(index) {
  let name = document.getElementById("name").value;
  let nameParts = name.split(" ");
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const oldInitials = contacts[index]["initials"];
  const oldInitialsIndex = firstLetters.indexOf(oldInitials);

  if (oldInitialsIndex !== -1) {
    firstLetters.splice(oldInitialsIndex, 1);
  }

  if (!firstLetters.includes(firstNameInitial)) {
    firstLetters.push(firstNameInitial);
  }
}
