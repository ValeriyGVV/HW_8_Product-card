// ======================время 9-50=====================================
function renderProducts(products) {
  const htmlStr = products.map(product => `<div class="card col-sm-6 col-md-4 col-lg-3">
              <img src="${product.thumbnail}" class="card-img-top" alt="${product.brand} ${product.title}">
              <div class="card-body">
                  <h5 class="card-title">${product.brand} ${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <a href="#" class="btn btn-primary">Add to Cart</a>
              </div>
          </div>`).join('');
  document.getElementById('products').innerHTML = htmlStr;
}

function getProductsByCategory(categoryName) {
  let url = 'https://dummyjson.com/products?limit=100';
  if(categoryName) {
    url = `https://dummyjson.com/products/category/${categoryName}`;
  }
  fetch(url).then(res => res.json()).then(data => {
    renderProducts(data.products);
  })
}

function setListeners() {
  document.getElementById('categories').onchange = e => {
    getProductsByCategory(e.currentTarget.value);
  }
}
// ----------------время 23-38---создание таблицы-------------
function renderCategories(categories) {
  const categoriesSelect = document.createElement('select');
  categoriesSelect.className = 'form-control';
  categoriesSelect.id = 'categories';
// -------------время 16_06---------------------------------------------
  let htmlStr = `<option value="">All</option>`;
  htmlStr += categories.map(category => `<option value="${category}">${category}</option>`).join('');
  categoriesSelect.innerHTML = htmlStr;
  document.querySelector('.categories-block').prepend(categoriesSelect);

  setListeners()
}
// =============Урок 9 время 6мин.45======================================
window.onload = function() {
  const productPromise = new Promise((resolve, reject) => {
    fetch('https://dummyjson.com/products?limit=100').then(res => res.json()).then(data => resolve(data.products))
  })

  const categoriesPromise = new Promise((resolve, reject) => {
    fetch('https://dummyjson.com/products/categories').then(res => res.json()).then(data => resolve(data))
  })

  Promise.all([productPromise, categoriesPromise]).then(data => {
    renderProducts(data[0]);
    renderCategories(data[1]);
  })
}
/*
Промис – это специальный объект, который хранит своё состояние, текущий результат (если есть) и колбэки.
При создании new Promise((resolve, reject) => ...) автоматически запускается функция-аргумент,
 которая должна вызвать resolve(result) при успешном выполнении и reject(error) – при ошибке.

Аргумент resolve/reject (только первый, остальные игнорируются) передаётся обработчикам на этом промисе.
Обработчики назначаются вызовом .then/catch.
Для передачи результата от одного обработчика к другому используется чейнинг.
У промисов есть некоторые ограничения. В частности, стандарт не предусматривает какой-то метод для «отмены» промиса,
 хотя в ряде ситуаций (http-запросы) это было бы довольно удобно.
  Возможно, он появится в следующей версии стандарта JavaScript.
  */