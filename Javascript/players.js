let tmp = document.querySelector(".d-flex");
tmp.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(tmp.search.value);
});
