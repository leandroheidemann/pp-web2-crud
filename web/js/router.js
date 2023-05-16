// Mapeamento entre rotas e manipuladores de página
const routes = {
  '/': homePage,
  '/users': userPage,
  '/cars': carPage
};

// Função para exibir a página com base na rota atual
function renderPage() {
  const path = window.location.pathname;
  const pageContent = routes[path] || notFoundPage;

  pageContent();

  document.getElementById('app').innerHTML = '';
}

window.addEventListener('popstate', renderPage);

function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderPage();
}

function homePage() {
  loadContent('home');
}

function userPage() {
  loadContent('user');
}

function carPage() {
  loadContent('car');
}

function notFoundPage() {
  loadContent('404');
}

function loadContent(route) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/pages/${route}.html`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const content = document.getElementById('app');
      content.innerHTML = xhr.responseText;

      var script = document.createElement('script');
      script.src = `js/${route}.js`;

      document.body.appendChild(script);
    }
  };
  xhr.send();
}

// Inicializar o roteador
renderPage();