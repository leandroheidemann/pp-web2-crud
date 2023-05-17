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
}

window.addEventListener('popstate', renderPage);

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
  fetch(`/pages/${route}.html`)
    .then(response => response.text())
    .then(html => {
      const content = document.getElementById('app');
      content.innerHTML = html;

      var script = document.createElement('script');
      script.type = 'module';
      script.src = `js/${route}.js`;

      document.body.appendChild(script);
    });
}

// Inicializar o roteador
renderPage();