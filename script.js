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

// Add a reminder
function addReminder() {
  const title = document.getElementById("title").value.trim();
  const time = document.getElementById("time").value;
  const note = document.getElementById("note").value.trim();

  if (!title || !time) { alert("Enter title and time!"); return; }

  reminders.push({ title, time, note, notified:false });
  saveReminders();
  displayReminders();
  updateNextReminder();

  document.getElementById("title").value = "";
  document.getElementById("time").value = "";
  document.getElementById("note").value = "";
}

// Display all reminders
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

// Edit reminder
function editReminder(index) {
  const r = reminders[index];
  const newTitle = prompt("Edit Title:", r.title);
  const newTime = prompt("Edit Time (HH:MM):", r.time);
  const newNote = prompt("Edit Note:", r.note);
  if (newTitle && newTime) {
    reminders[index] = { title:newTitle, time:newTime, note:newNote, notified:false };
    saveReminders();
    displayReminders();
    updateNextReminder();
  }
}

// Delete reminder
function deleteReminder(index) {
  reminders.splice(index,1);
  saveReminders();
  displayReminders();
  updateNextReminder();
}

// Save reminders to localStorage
function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

// ===== Reminder Countdown & Active Highlight =====
const nextReminderDisplay = document.getElementById("nextReminder");

function updateNextReminder() {
  if(reminders.length===0){ 
    nextReminderDisplay.innerText="No upcoming reminders"; 
    return; 
  }

  const now = new Date();
  const upcoming = reminders
    .filter(r => {
      const [h,m] = r.time.split(":").map(Number);
      const rTime = new Date();
      rTime.setHours(h, m, 0, 0);
      return rTime > now;
    })
    .sort((a,b)=>a.time.localeCompare(b.time));

  if(upcoming.length>0){
    const next = upcoming[0];
    const [h,m] = next.time.split(":").map(Number);
    const rTime = new Date();
    rTime.setHours(h, m, 0, 0);
    const diff = Math.floor((rTime-now)/60000);
    nextReminderDisplay.innerText = `Next reminder "${next.title}" in ${diff} min`;
  } else {
    nextReminderDisplay.innerText = "No upcoming reminders";
  }
}

// Check reminders every minute
function checkReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);
  reminders.forEach((r,index)=>{
    const li = reminderList.children[index];
    if(r.time===currentTime && !r.notified){
      document.getElementById("reminderSound").play();
      alert(`Reminder: ${r.title}\nNote: ${r.note}`);
      if(Notification.permission==="granted") {
        new Notification("Health Reminder",{body:`${r.title} - ${r.note}`, icon:"https://cdn-icons-png.flaticon.com/512/3103/3103446.png"});
      }
      r.notified=true;
      saveReminders();
      li.classList.add("active-reminder");
      setTimeout(()=> li.classList.remove("active-reminder"), 60000); // highlight 1 min
    }
  });
}

setInterval(checkReminders, 60000);
displayReminders();
updateNextReminder();

// ===== BMI Calculator =====
const bmiHistoryList = document.getElementById("bmiHistory");
const bmiProgress = document.getElementById("bmiProgress");
const bmiIcon = document.getElementById("bmiIcon");
let bmiHistory = JSON.parse(localStorage.getItem("bmiHistory")) || [];

// Calculate BMI
function calculateBMI() {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value)/100;
  if(!weight||!height){ alert("Enter valid weight & height"); return; }

  const bmi = (weight/(height*height)).toFixed(2);
  let category="", color="", icon="";
  if(bmi<18.5){ category="Underweight"; color="#17a2b8"; icon="https://cdn-icons-png.flaticon.com/512/742/742751.png"; }
  else if(bmi<24.9){ category="Normal"; color="#28a745"; icon="https://cdn-icons-png.flaticon.com/512/742/742752.png"; }
  else if(bmi<29.9){ category="Overweight"; color="#ffc107"; icon="https://cdn-icons-png.flaticon.com/512/742/742753.png"; }
  else { category="Obese"; color="#dc3545"; icon="https://cdn-icons-png.flaticon.com/512/742/742754.png"; }

  document.getElementById("bmiResult").innerText = `BMI: ${bmi} (${category})`;
  bmiProgress.style.width = Math.min(bmi*3,100)+"%";
  bmiProgress.style.backgroundColor = color;
  bmiProgress.innerText = category;
  bmiIcon.style.backgroundImage = `url(${icon})`;

  const date = new Date().toLocaleString();
  bmiHistory.push(`${date}: BMI ${bmi} (${category})`);
  localStorage.setItem("bmiHistory", JSON.stringify(bmiHistory));
  displayBMIHistory();
}

// Display BMI history
function displayBMIHistory(){
  bmiHistoryList.innerHTML="";
  bmiHistory.forEach(item=>{
    const li=document.createElement("li");
    li.textContent=item;
    bmiHistoryList.appendChild(li);
  });
}

// Clear BMI history
function clearBMIHistory(){
  if(confirm("Clear BMI history?")){
    bmiHistory=[]; 
    localStorage.removeItem("bmiHistory"); 
    displayBMIHistory();
  }
}

displayBMIHistory();
