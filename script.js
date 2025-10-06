// ===== Tab Navigation =====
function showTab(cardId, btn) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(cardId).classList.add('active');
  btn.classList.add('active');
}

// ===== Reminder App =====
const reminderList = document.getElementById("reminderList");
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function addReminder() {
  const title = document.getElementById("title").value.trim();
  const time = document.getElementById("time").value;
  const note = document.getElementById("note").value.trim();

  if (!title || !time) { alert("Enter title and time!"); return; }

  reminders.push({ title, time, note, notified:false });
  saveReminders();
  displayReminders();

  document.getElementById("title").value = "";
  document.getElementById("time").value = "";
  document.getElementById("note").value = "";
}

function displayReminders() {
  reminderList.innerHTML = "";
  reminders.forEach((r, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${r.time} - ${r.title}
      <span class="li-buttons">
        <button class="edit-btn" onclick="editReminder(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteReminder(${index})">Delete</button>
      </span>`;
    reminderList.appendChild(li);
  });
}

function editReminder(index) {
  const r = reminders[index];
  const newTitle = prompt("Edit Title:", r.title);
  const newTime = prompt("Edit Time (HH:MM):", r.time);
  const newNote = prompt("Edit Note:", r.note);
  if (newTitle && newTime) {
    reminders[index] = { title:newTitle, time:newTime, note:newNote, notified:false };
    saveReminders();
    displayReminders();
  }
}

function deleteReminder(index) {
  reminders.splice(index,1);
  saveReminders();
  displayReminders();
}

function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function checkReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);
  reminders.forEach(r=>{
    if(r.time===currentTime && !r.notified){
      document.getElementById("reminderSound").play();
      alert(`Reminder: ${r.title}\nNote: ${r.note}`);
      if(Notification.permission==="granted") {
        new Notification("Health Reminder",{body:`${r.title} - ${r.note}`, icon:"https://cdn-icons-png.flaticon.com/512/3103/3103446.png"});
      }
      r.notified=true;
      saveReminders();
    }
  });
}

setInterval(checkReminders, 60000);
displayReminders();

// ===== BMI Calculator =====
const bmiHistoryList = document.getElementById("bmiHistory");
const bmiProgress = document.getElementById("bmiProgress");
