function startOnce(fn, context) {
    let result = false;
  
    return function () {
      if (fn) {
        result = fn.apply(context || this, arguments);
        fn = null;
      }
      return result;
    };
  }
  
  function checkAuth() {
    if (!localStorage.getItem("buttonClicked")) {
      window.location.href = "./authorization.html";
    }
  }
  
  const start = startOnce(checkAuth);
  
  start();
  
  document.addEventListener("DOMContentLoaded", function () {
    const iconWrappers = document.querySelectorAll(".icon-wrapper");
    iconWrappers.forEach((wrapper) => {
      wrapper.addEventListener("click", function () {
        const url = this.getAttribute("data-url");
        if (url) {
          window.location.href = url;
        }
      });
    });
    renderTargets();
  });
  
  function renderTargets() {
    let targets = JSON.parse(localStorage.getItem("targets")) || [];
  
    const settings=JSON.parse(localStorage.getItem('settings'))|| [];
  
    const superPriorityId=settings.superPriorityId;
    const priorityLevel=settings.priorityLevel;
    const priorityTime=settings.priorityTime;
  
    const superPriorityTargets=targets.find(target=> Number(target.id)===Number(superPriorityId));
    const priorityTargets=targets.filter(target=>target.priorityLevel===priorityLevel && target.priorityTime===priorityTime);
    console.log(priorityTargets)
  
    const sortedTargets = [];
  
    if(superPriorityTargets){
      sortedTargets.push(superPriorityTargets);
    }
   sortedTargets.push(...priorityTargets);
   
   const greetingItemsContainer = document.getElementById("greeting__items");
  
   greetingItemsContainer.innerHTML = ''; 
  
   if (sortedTargets.length === 0) {
       const noTargetsMessage = document.createElement('p');
       noTargetsMessage.classList.add('greeting-targets-message');
       noTargetsMessage.textContent = 'Приоритетных целей пока нет...';
       greetingItemsContainer.appendChild(noTargetsMessage);
   } else {
       sortedTargets.forEach(target => {
   // Проверяем, нет ли уже такой цели в контейнере
           if (!document.querySelector(`[data-id="${target.id}"]`)) {
   // Передаем функции добавления цели в ДОМ не только цель, но и id супер приоритетной цели, иначе не работает
               addTargetToDOM(target, superPriorityId); 
           }
       });
  }
}
  
  function addTargetToDOM(target) {
  
    const greetingItemsContainer = document.getElementById("greeting__items");
    const targetElement = document.createElement("div");
    targetElement.classList.add("greeting_items-item");
    targetElement.setAttribute("data-id", target.id);
  
    const progressPercent = Math.min((target.progress / target.amount) * 100, 100);
    const progressPercentRound = Math.round(progressPercent);
    let progressColor = "rgba(223, 34, 22, 1)";
    if (progressPercent >= 20) progressColor = "rgba(182, 204, 45, 1)";
    if (progressPercent >= 80) progressColor = "rgba(80, 219, 58, 1)";
  
    const remainingAmount = Math.max(target.amount - target.progress, 0);
  
  targetElement.innerHTML = `
         <div class="greeting__items-item__top">
         <h3 class="greeting__items-item__top-title">${target.name}</h3>
          </div>
          <span class="progress-label">Прогресс цели:</span>
          <div class="progress-bar__wrapper">
        
              <div class="progress-bar" style="width: ${progressPercent}%; background-color: ${progressColor};"><p>${progressPercentRound}%</p></div>
          </div>   
          <div class="greeting-info__amount">
          <span class="progress-info__label">Осталось собрать:</span>
          <span class="progress-info__remaining">${remainingAmount} ₽</span>
  
          <div class="target__items-item__top-link__wrapper">
          <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.02968 3.88318L9.43938 7.29287C9.8299 7.6834 9.8299 8.31656 9.43938 8.70709L6.02968 12.1168"
                  stroke="#292929"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  />
          </svg>
      </div>
      </div>`;
  
  greetingItemsContainer.appendChild(targetElement);
  
      // Получаем элемент иконки редактирования цели внутри карточки цели
      const editIconWrapper = targetElement.querySelector('.target__items-item__top-link__wrapper');
      editIconWrapper.addEventListener('click', function () {
          const targetId = targetElement.getAttribute('data-id');
          localStorage.setItem('editingTargetId', String(targetId));
          window.location.href = './targetchange.html'
      })
  };
  
  function targetToChart(target){
    const ctx1 = document.getElementById('chart1').getContext('2d');

    const currentDate=new Date();
    console.log(currentDate)
    const lastWeekDays=[];
  
    for(let i =6;i>0; i--){
      const day=new Date(currentDate);
      day.setDate(currentDate.getDate()-i);
      const formatedDate=`${day.getDate().toString().padStart(2,'0')}.${(day.getMonth()+1).toString().padStart(2,'0')}`;
      lastWeekDays.push(formatedDate)
    }
  
    const ctx2 = document.getElementById('chart2').getContext('2d');
  
    const fundsChart = new Chart(chart1, {
        type: 'line',
        data: {
            labels: lastWeekDays, // можно добавить текущую дату
            datasets: [{
                label: 'Всего средств (тыс.)',
                data: [30, 50, 70, 120, 90, 110], // тут можно добавить переменную с количеством пополненных денег, котоая увеличивается или уменьшается при удалении цели 
                fill: true,
                backgroundColor:'rgba(1, 112, 223, 0)',
                borderColor:  'rgba(32, 181, 238, 0.67)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  
    const goalsChart = new Chart(chart2, {
        type: 'line',
        data: {
            labels:lastWeekDays,
            datasets: [{
                label:  'Всего целей (шт.)',
                data: [20, 30, 25, 50, 45, 30],// тут можно добавить переменную с количеством целей, которая увеличивается или уменьшается при добавлении или удалении целей
                backgroundColor:'rgba(1, 112, 223, 0)',
                borderColor:  'rgba(32, 181, 238, 0.67)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  };
  targetToChart();
  