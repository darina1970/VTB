document.getElementById("authorizationBtn").addEventListener("click", function () {
    localStorage.setItem("buttonClicked", true);
    window.location.href = "./index.html";
    console.log("hello");
});