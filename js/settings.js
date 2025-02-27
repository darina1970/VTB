document.addEventListener('DOMContentLoaded', () => {
  const iconWrappers = document.querySelectorAll('.icon-wrapper');
    iconWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });

    const currentUrl = window.location.pathname.split('/').pop();
    const navIcons = document.querySelectorAll('.common-icon-wrapper');
    navIcons.forEach(icon => {
        const iconUrl = icon.getAttribute('data-url');
        console.log(iconUrl);
        console.log(currentUrl);
        if (iconUrl && currentUrl === iconUrl) {
            icon.classList.add('active');
        }
    });

  loadTargets();
  addTargetNamesToDropdown();
  loadSettings();
});

const superPriority = document.getElementById("superPriority");
const goalName = document.getElementById("selectItem");
const goalPriority = document.getElementsByName("goalPriority");
const goalTime = document.getElementsByName("goalTime");
const saveButtonSettings = document.getElementById("saveButtonSettings");

let targets = []

function loadTargets() {
  const storedTargets = localStorage.getItem('targets');
  targets = storedTargets ? JSON.parse(storedTargets) : [];
}

function addTargetNamesToDropdown() {
  // goalName.innerHTML = '<option hidden value="">Выберите цель</option>'
  if(targets.length === 0) {
    goalName.innerHTML += '<option value="">Нет доступных целей</option>';
    return;
  }
  targets.forEach(target => {
    let option = document.createElement('option');
    option.value = target.id;
    option.textContent = target.name;
    goalName.appendChild(option);
  })
}

function saveSettings() {
  const selectedGoalId = goalName.value;
  const isSuperPriority = superPriority.checked;

  let selectedPriorityLevel = ''
  goalPriority.forEach(radio => {
    if (radio.checked) selectedPriorityLevel = radio.value;
  });

  let selectedPriorityTime = ''
  goalTime.forEach(radio => {
    if (radio.checked) selectedPriorityTime = radio.value;
  });

  const settings = {
    superPriorityId: isSuperPriority ? selectedGoalId : null,
    priorityLevel: selectedPriorityLevel,
    priorityTime: selectedPriorityTime
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  alert('Настройки сохранены')
}

function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('settings'));

  if (savedSettings.superPriorityId) {
    goalName.value = savedSettings.superPriorityId;
    superPriority.checked = true;
  } else {
    superPriority.checked = false;
  }

  goalPriority.forEach(radio => {
    if (radio.value === savedSettings.priorityLevel) {
      radio.checked = true;
    }
  });

  goalTime.forEach(radio => {
    if (radio.value === savedSettings.priorityTime) {
      radio.checked = true;
    }
  });
}

saveButtonSettings.addEventListener('click', saveSettings)
