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

    
// Для Саши Предлагаю при загрузке документа, объявить функцию установки минимальной даты. Чтобы несколько раз нам не загрудать DOMContentLoaded
    setMinDate();

    const targetImageInput = document.getElementById("targetImage");
    const previewImage = document.getElementById("previewImage");

    targetImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function() {
                    // Устанавливаем превью изображения
                    previewImage.src = img.src;
                };
            };

            reader.readAsDataURL(file);
        }
    });

    const saveGoalBtn = document.getElementById('saveGoalBtn');
    saveGoalBtn.addEventListener('click', saveGoal);
    const cancelGoalBtn = document.getElementById("cancelGoalBtn");
    if (cancelGoalBtn) {
        cancelGoalBtn.addEventListener('click', cancelGoal)
    }
// Для Саши Предлагаю сразу здесь и кнопку назад обозначить, раз мы здесь объявляем кнопку сохранить и отменить
    const backBtn = document.getElementById('backButton');
    backBtn.addEventListener('click', goBack);
});

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    document.getElementById('endDate').min = today;
}

// Для Саши Функция для возврата назад
function goBack() {
    window.history.back();
}


function cancelGoal() {
    // Подтверждение перед удалением
    const confirmCancel = confirm("Вы уверены, что хотите отменить цель? Данные будут удалены.");
    if (!confirmCancel) return;

    // Очищаем поля формы (если есть)
    document.getElementById("targetForm").reset();
    previewImage.src = './assets/images/img/default-image.png';

}

function saveGoal() {
    const targetName = document.getElementById("targetName").value.trim();
    const targetAmount = document.getElementById("targetAmount").value.trim();
// Для Саши Убрала первоначальный взнос
    // let initialDeposit = document.getElementById("initialDeposit").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const targetImageInput = document.getElementById("targetImage");
    const priorityTimeSelect = document.getElementById('priorityTime');
    const priorityLevelSelect = document.getElementById('priorityLevel');

// Для Саши. Саш, пожалуйста, поменяй последние строчки на эти. Это очень важно для моей страницы
    // const priorityTimeText = priorityTimeSelect.options[priorityTimeSelect.selectedIndex].text;
    // const priorityLevelText = priorityLevelSelect.options[priorityLevelSelect.selectedIndex].text;
    const priorityTime = priorityTimeSelect.value || null;
    const priorityLevel = priorityLevelSelect.value || null;

    if (!targetName || !targetAmount) {
        alert("Введите название и сумму цели!");
        return;
    }


    const targetAmountNum = Number(targetAmount);

// Для Саши. Выносим нулевой вклад сюда
    const initialDeposit = 0;


    // Создаём объект новой цели. По дефолту устанавливаем картинку, если пользователь не добавит картинку цели
    let newTarget = {
        id: Date.now(),
        name: targetName,
        amount: targetAmountNum,
        progress: initialDeposit,
        startDate,
        endDate,
        // Для Саши: Вот такие приоритеты устанавливаем. 
        priorityTime,
        priorityLevel,
        // priorityTimeText,
        // priorityLevelText,
        image: "./assets/images/img/default-image.png",
        progressHistory: [] 
    };

    if (targetImageInput.files.length > 0) {
        const file = targetImageInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            


            img.onload = function () {

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
                newTarget.image = canvas.toDataURL("image/jpeg", 0.8);

// Для Саши: Предлагаю вынести отдельную функцию для сохранения в хранилище
                saveToLocalStorage(newTarget)
            };
        };

        reader.readAsDataURL(file);
    } 
    else {
// Для Саши
        saveToLocalStorage(newTarget)
    }
}
// Для Саши
function saveToLocalStorage(target) {
    let targets = JSON.parse(localStorage.getItem("targets")) || [];
    targets.push(target);
    localStorage.setItem("targets", JSON.stringify(targets));
    alert("Цель сохранена!");
    window.location.href = "./targets.html";
}



// targetImageInput.addEventListener('change', function () {
//     // Проверяем выбран ли был файл
//     if (this.files?.[0]) {
//     // Получаем файл
//         const file = this.files[0];
//     // Создаём объект для чтения файла
//         const reader = new FileReader();
//         reader.onload = function (event) {
//     // Показываем превью
//             targetImage.src = event.target.result;
//             targetImage.style.display = 'inline-block'

//             const img = new Image();
//             img.src = event.target.result;

//             img.onload = function() {
//                 compressAndSaveImage(img);
//             };
//         };
//         reader.readAsDataURL(file);
//     };
// });

// function compressAndSaveImage(img) {
//     // Сжимаем картинку с помощью canvas
//     const canvas = document.createElement("canvas");
//     // Прописываем контекст рисования для рисования 2d графики
//     const ctx = canvas.getContext("2d");

//     const maxWidth = 270; // Максимальная ширина
//     const maxHeight = 275; // Максимальная высота
//     let width = img.width;
//     let height = img.height;

//     // Сохраняем пропорции
//     if (width > maxWidth || height > maxHeight) {
//         const scale = Math.min(maxWidth / width, maxHeight / height);
//         width *= scale;
//         height *= scale;
//     }

//     canvas.width = width;
//     canvas.height = height;
//     ctx.drawImage(img, 0, 0, width, height);

//     // Преобразуем в сжатый base64 (JPEG, 80% качества)
//     target.image = canvas.toDataURL("image/jpeg", 0.8);
//     targetImage.src = target.image;

//     // Сохраняем в local Storage
//     localStorage.setItem('targets', JSON.stringify(targets));
// };
