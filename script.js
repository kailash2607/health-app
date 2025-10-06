const reminderList = document.getElementById("reminderList");
let reminders = [];

function addReminder() {
  const title = document.getElementById("title").value;
  const time = document.getElementById("time").value;
  const note = document.getElementById("note").value;

  if (!title || !time) {
    alert("Please enter title and time!");
    return;
  }

  const reminder = { title, time, note };
  reminders.push(reminder);
  displayReminders();

  checkReminder(reminder);

  // Clear inputs
  document.getElementById("title").value = "";
  document.getElementById("time").value = "";
  document.getElementById("note").value = "";
}

function displayReminders() {
  reminderList.innerHTML = "";
  reminders.forEach((r) => {
    const div = document.createElement("div");
    div.classList.add("reminder");
    div.innerHTML = `
      <strong>${r.title}</strong><br>
      ⏰ Time: ${r.time}<br>
      📝 ${r.note || "No note"}
    `;
    reminderList.appendChild(div);
  });
}

function checkReminder(reminder) {
  const reminderTime = new Date();
  const [hours, minutes] = reminder.time.split(":");
  reminderTime.setHours(hours);
  reminderTime.setMinutes(minutes);
  reminderTime.setSeconds(0);

  const now = new Date();
  let diff = reminderTime - now;

  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  setTimeout(() => {
    alert(`⏰ Reminder: ${reminder.title}\n${reminder.note}`);
  }, diff);
}
