document.addEventListener('DOMContentLoaded', function () {
    // Переходы по страницам по клику на иконки навигационной панели
    const iconWrappers = document.querySelectorAll('.icon-wrapper');
    iconWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    // const backButton = document.getElementById('backButton');
    // backButton.addEventListener('click', () => {
    //     window.location.href = 'targets.html';
    // })
    });

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        window.history.back();
    });

    const userPhoto = document.getElementById('userPhoto');
    const dropdownMenu = document.getElementById('dropdownMenu');

    userPhoto.addEventListener('click', function (event) {
        dropdownMenu.classList.toggle('visible'); 
        event.stopPropagation();
    });

    document.addEventListener('click', function (event) {
        if (!userPhoto.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('visible');
        }
    });
    
    const targetId = localStorage.getItem('editingTargetId'); // Получаем ID цели
    console.log('Цель', targetId)
    // Загружаем все цели
    const targets = JSON.parse(localStorage.getItem('targets')) || []; 
    // Ищем нужную цель
    const target = targets.find(t => String(t.id) === targetId); 


    if (!target) {
        alert('Цель не найдена!');
        return;
    }




// Находим элементы на странице. А именно отображаемый сразу и инпут, на который элемент заменится при редактировании
    const targetTitle = document.getElementById("targetTitle");
    const targetTitleInput = document.getElementById('targetTitleInput');

    const targetInfoTitle = document.getElementById('targetInfoTitle');

    const targetSum = document.getElementById("targetSum");
    const targetSumInput = document.getElementById('targetSumInput')

    const priorityLevel = document.getElementById("priorityLevel");
    const priorityLevelSelect = document.getElementById('priorityLevelSelect');


    const priorityTime = document.getElementById('priorityTime');
    const priorityTimeSelect = document.getElementById('priorityTimeSelect');
    
    const startDate = document.getElementById("startDate");
    const startDateInput = document.getElementById('startDateInput');

    const endDate = document.getElementById("endDate");
    const endDateInput = document.getElementById('endDateInput');

    const targetImage = document.getElementById("targetImage");
    const targetImageInput = document.getElementById('targetImageInput');

    const progressBar = document.querySelector(".progress-bar__wrapper");
    const addAmountInput = document.getElementById("addAmount");
    const addAmountBtn = document.getElementById("addAmountBtn");
    const warningMessage = document.getElementById('depositWarningMessage');
    const editButton = document.querySelector(".edit-button");
    const resetButton = document.querySelector(".reset-button");
    const deleteButton = document.querySelector('.delete-button');

    function formatDate(dateString) {
        if(!dateString) return 'Не указана';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDateInput').min = today;
        document.getElementById('endDateInput').min = today;
    }

    
    function getPriorityText(type, value) {
        const priorityOptions = {
            priorityLevel: {
                high: "Высокий",
                average: "Средний",
                low: "Низкий"
            },
            priorityTime: {
                shortTerm: "Краткосрочная",
                longTerm: "Долгосрочная"
            }
        };

        return priorityOptions[type]?.[value] || 'Не указан';
    }

    // Заполняем данными страницу цели, а также заполняем этими же данными инпуты, которые откроются при редактировании
    targetTitle.textContent = target.name;
    targetTitleInput.value = target.name;
    targetSum.textContent = `${target.amount} ₽;`
    targetSumInput.value = target.amount;
    // priorityLevel.textContent = target.priorityLevel || 'Не указан';

    priorityLevelSelect.value = target.priorityLevel || '';
    priorityLevel.textContent = getPriorityText('priorityLevel', target.priorityLevel);

    // priorityTime.textContent = target.priorityTime || 'Не указан';

    priorityTime.textContent = getPriorityText('priorityTime', target.priorityTime);
    priorityTimeSelect.value = target.priorityTime || '';


    startDate.textContent = formatDate(target.startDate);
    startDateInput.value = target.startDate;
    endDate.textContent = formatDate(target.endDate);
    endDateInput.value = target.endDate;
    targetImage.src = target.image || './assets/images/img/default-image.png';

    // Вычисляем процент прогресса
    function updateProgressBar() {
        const progressPercent = Math.min((target.progress / target.amount) * 100, 100);
        const progressPercentRound = Math.round(progressPercent);
        let progressColor = "rgba(223, 34, 22, 1)";
        if (progressPercent >= 20) progressColor = "rgba(182, 204, 45, 1)";
        if (progressPercent >= 80) progressColor = "rgba(80, 219, 58, 1)";

        progressBar.innerHTML = `<div class="progress-bar" style="width: ${progressPercent}%; background-color: ${progressColor};"><p>${progressPercentRound}%</p></div>`
    }
    
    updateProgressBar();

    let isEditing = false;

    // Вешаем слушателя события клик на кнопку редактировать
    editButton.addEventListener('click', () => {
        if (!isEditing) {
            setMinDate();
    // Отключаем кнопку пополнения в режиме редактирования цели
            addAmountBtn.disabled = true;
            addAmountBtn.classList.add('disabled');

    // Выключаем статичные поля, подключаем динамические инпуты для введения отредактированной информации
            targetTitle.style.display = 'none';
            targetTitleInput.style.display = 'inline-block';
            targetInfoTitle.style.display = 'none';
            targetSum.style.display = 'none';
            targetSumInput.style.display = 'inline-block';
            priorityLevel.style.display = 'none';
            priorityLevelSelect.style.display = 'inline-block';
            priorityTime.style.display = 'none';
            priorityTimeSelect.style.display = 'inline-block';
            startDate.style.display = 'none';
            startDateInput.style.display = 'inline-block';
            endDate.style.display = 'none';
            endDateInput.style.display = 'inline-block';
            progressBar.style.display = 'none';
            targetImage.style.display = 'inline-block';
            targetImage.src = target.image;
            targetImageInput.style.display = 'inline-block';

    // Меняем кнопку Редактировать на кнопку Сохранить
            editButton.textContent = 'Сохранить';
            resetButton.style.display = 'inline-block';
            deleteButton.style.display = 'none';


        } else {

    // Включаем кнопку пополнения
            addAmountBtn.disabled = false;
            addAmountBtn.classList.remove('disabled');

            const newTitle = targetTitleInput.value.trim();
            const newSum = targetSumInput.value.trim();
            const newStartDate = startDateInput.value;
            const newEndDate = endDateInput.value;
            const newPriorityLevel = priorityLevelSelect.value || null;
            const newPriorityTime = priorityTimeSelect.value || null;
            // const newPriorityLevelText = priorityLevelSelect.options[priorityLevelSelect.selectedIndex].text;
            // const newPriorityTimeText = priorityTimeSelect.options[priorityTimeSelect.selectedIndex].text;

            const newPriorityLevelText = getPriorityText('priorityLevel', newPriorityLevel);
            const newPriorityTimeText = getPriorityText('priorityTime', newPriorityTime);

    // Валидация базовая введённых данных
            if(!newTitle) {
                alert('Введите название цели!');
                return;
            }
            if(!newSum || isNaN(newSum) || Number(newSum) <= 0) {
                alert('Сумма цели должна быть числом больше 0!');
                return;
            }
            if(newStartDate && newEndDate && newEndDate < newStartDate) {
                alert('Дата завершения не может быть раньше даты начала!');
                return;
            }


            // const newPriorityLevelText = priorityLevelSelect.options[priorityLevelSelect.selectedIndex].text;
            // const newPriorityTimeText = priorityTimeSelect.options[priorityTimeSelect.selectedIndex].text;
    // Обновляем данные при клике на Сохранить
            targetTitle.textContent = newTitle;
            targetSum.textContent = `${newSum}  ₽`;
            // priorityLevel.textContent = newPriorityLevel || 'Не указан';
            priorityLevel.textContent = newPriorityLevelText;
            priorityTime.textContent = newPriorityTimeText;
            // priorityTime.textContent = newPriorityTime || 'Не указан';
            startDate.textContent = formatDate(newStartDate);
            endDate.textContent = formatDate(newEndDate);

    // Обновляем объект цели
            target.name = newTitle;
            target.amount = newSum;
            target.startDate = newStartDate;
            target.endDate = newEndDate;
            target.priorityTime = newPriorityTime;
            // target.priorityTimeText = newPriorityTimeText;
            target.priorityLevel = newPriorityLevel;
            // target.priorityLevelText = newPriorityLevelText;


            saveToLocalStorage();


    // Выходим из режима редактирования, скрываем инпуты
            targetTitle.style.display = 'inline-block';
            targetTitleInput.style.display = 'none'
            targetSum.style.display = 'inline-block';
            targetSumInput.style.display = 'none';
            priorityLevel.style.display = 'inline-block';
            priorityLevelSelect.style.display = 'none';
            priorityTime.style.display = 'inline-block';
            priorityTimeSelect.style.display = 'none';
            startDate.style.display = 'inline-block';
            startDateInput.style.display = 'none';
            endDate.style.display = 'inline-block';
            endDateInput.style.display = 'none';
            progressBar.style.display = 'inline-block';
            targetImageInput.style.display = "none";
            targetImage.style.display = "inline-block"
            editButton.textContent = 'Редактировать';
            resetButton.style.display = 'none';
            deleteButton.style.display = 'inline-block';
    // Обновляем прогресс-бар
            updateProgressBar();

        }
    // Отключаем режим редактирования, используем логическое отрицание. Во время редактирования было true, станет опять false
        isEditing = !isEditing
    });

    addAmountBtn.addEventListener('click', () => {
    // Получаем сумму из инпута
        const addedAmount = addAmountInput.value.trim();
    // Проверяем введённую сумму
        const deposit = parseFloat(addedAmount);
        if (isNaN(deposit) || deposit <= 0) {
            alert('Введите корректную сумму');
            return
        }
        target.progress += deposit;
        
        const currentDate = new Date().toISOString().split('T')[0];
        target.progressHistory.push({date: currentDate, progress: target.progress});


        alert('Цель успешно пополнена');

        saveToLocalStorage();

        updateProgressBar();

        addAmountInput.value = '';


    });

    // Выводим сообщение-предупреждение при попытке пополнить цель до завершения её редактирования

    addAmountInput.addEventListener('focus', function() {
        if(isEditing === true) {
            warningMessage.textContent = 'Сначала завершите редактирование цели';
            warningMessage.style.display = 'block';

            setTimeout(() => {
                warningMessage.style.display = 'none';
            }, 2000);

            this.blur();
        }
    });

    targetImageInput.addEventListener('change', function () {
        // Проверяем выбран ли был файл
        if (this.files?.[0]) {
        // Получаем файл
            const file = this.files[0];
        // Создаём объект для чтения файла
            const reader = new FileReader();
            reader.onload = function (event) {
        // Показываем превью
                targetImage.src = event.target.result;
                targetImage.style.display = 'inline-block'

                const img = new Image();
                img.src = event.target.result;

                img.onload = function() {
                    compressAndSaveImage(img);
                };
            };
            reader.readAsDataURL(file);
        };
    });

    function compressAndSaveImage(img) {
        // Сжимаем картинку с помощью canvas
        const canvas = document.createElement("canvas");
        // Прописываем контекст рисования для рисования 2d графики
        const ctx = canvas.getContext("2d");

        const maxWidth = 270; // Максимальная ширина
        const maxHeight = 275; // Максимальная высота
        let width = img.width;
        let height = img.height;

        // Сохраняем пропорции
        if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Преобразуем в сжатый base64 (JPEG, 80% качества)
        target.image = canvas.toDataURL("image/jpeg", 0.8);
        targetImage.src = target.image;

        // Сохраняем в local Storage
        localStorage.setItem('targets', JSON.stringify(targets));
    };

    function saveToLocalStorage() {
        const targetIndex = targets.findIndex(t => t.id == targetId)
        if (targetIndex !== -1) {
            targets[targetIndex] = target;
            
            localStorage.setItem('targets', JSON.stringify(targets));
        }
    };


    // Вешаем слушателя события клик на кнопку Отмена
    resetButton.addEventListener('click', () => {
    // Отмена изменений
        isEditing = false;

        targetTitle.style.display = 'inline-block';
        targetTitleInput.style.display = 'none'
        targetSum.style.display = 'inline-block';
        targetSumInput.style.display = 'none';
        priorityLevel.style.display = 'inline-block';
        priorityLevelSelect.style.display = 'none';
        priorityTime.style.display = 'inline-block';
        priorityTimeSelect.style.display = 'none';
        startDate.style.display = 'inline-block';
        startDateInput.style.display = 'none';
        endDate.style.display = 'inline-block';
        endDateInput.style.display = 'none';
        progressBar.style.display = 'inline-block';
        targetImageInput.style.display = "none";
        targetImage.style.display = "inline-block";

        targetTitleInput.value = target.name;
        targetSumInput.value = target.amount;
        priorityLevelSelect.value = target.priorityLevel || 'Не указан';
        priorityTimeSelect.value = target.priorityTime || 'Не указан';
        startDateInput.value = target.startDate;
        endDateInput.value = target.endDate;

        addAmountBtn.disabled = false;
        addAmountBtn.classList.remove('disabled');

        editButton.textContent = 'Редактировать';
        resetButton.style.display = 'none';
        deleteButton.style.display = "inline-block";


    });

    deleteButton.addEventListener('click', () => {
    // Подтверждение перед удалением
    const confirmCancel = confirm("Вы уверены, что хотите удалить цель? Данные будут удалены без возможности восстановления.");
    if (!confirmCancel) return;

    const targets = JSON.parse(localStorage.getItem('targets')) || [];
    const targetId = localStorage.getItem('editingTargetId');
    const updatedTargets = targets.filter(target => target.id !== Number(targetId));

    localStorage.setItem('targets', JSON.stringify(updatedTargets));

    alert('Цель успешно удалена');
    window.location.href = 'targets.html'


    });


});