function createPagination(data) {
  let count = data.total / data.limit;
  let htmlStr = '';
  const pageNumber = (data.skip / 10) + 1;
  for(let item = 0; item < count; item++) {
    htmlStr += `<li class="page-item ${pageNumber === item + 1 ? 'active' : ''}">
                <span class="page-link">${+item + 1}</span>
            </li>`;
  }
  document.querySelector('.pagination').innerHTML = htmlStr;
}

function renderProducts(data) {
  const {products} = data;
  console.log(data);

  const htmlStr = products.map(product => `<div class="card col-sm-6 col-md-4 col-lg-3">
              <img src="${product.thumbnail}" class="card-img-top" alt="${product.brand} ${product.title}">
              <div class="card-body d-flex justify-content-between flex-column">
                  <div>
                    <h5 class="card-title">${product.brand} ${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    </div>
                  <a href="#" class="btn btn-primary align-self-center mt-3">Add to Cart</a>
              </div>
          </div>`).join('');
  document.getElementById('products').innerHTML = htmlStr;

  createPagination(data);
}

function getProductsByCategory(categoryName) {
  let url = 'https://dummyjson.com/products?limit=10';
  if(categoryName) {
    url = `https://dummyjson.com/products/category/${categoryName}`;
  }
  fetch(url).then(res => res.json()).then(data => {
    renderProducts(data);
  })
}

function getNewProductsPortion(skip) {
  fetch('https://dummyjson.com/products?limit=10&skip=' + skip)
      .then(res => res.json())
      .then(data => renderProducts(data));
}

function setListeners() {
  document.querySelector('.pagination').onclick = e =>  {
    console.log(e.target);
    let newPage = e.target.innerText;
    console.log(newPage);
    getNewProductsPortion((+newPage - 1) * 10);
  }
}

function renderCategories(categories) {
  $( "#categories" ).autocomplete({
    source: categories,
    minLength: 0,
    select: function( event, ui ) {
      getProductsByCategory(ui.item.value);
    }
  });
  setListeners();
}

window.onload = function() {
  const productPromise = new Promise((resolve, reject) => {
    fetch('https://dummyjson.com/products?limit=10').then(res => res.json()).then(data => resolve(data))
  })

  const categoriesPromise = new Promise((resolve, reject) => {
    fetch('https://dummyjson.com/products/categories').then(res => res.json()).then(data => resolve(data))
  })

  Promise.all([productPromise, categoriesPromise]).then(data => {
    renderProducts(data[0]);
    renderCategories(data[1]);
  })
}
