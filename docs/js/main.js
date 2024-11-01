async function loadTemplate(url, templateId, placeholderId) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }
  
  const text = await response.text();

  const div = document.createElement('div');
  div.innerHTML = text;

  const template = div.querySelector(`#${templateId}`);
  document.getElementById(placeholderId).innerHTML = template.innerHTML;
}

document.querySelectorAll('.shop-menu-inner a').forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault(); 

    const productId = new URL(event.target.href).searchParams.get('product'); // クリックされたリンクから商品IDを取得
    console.log("Clicked product ID:", productId);

    await updateProductDetails(productId);
    
    history.pushState(null, '', event.target.href);
  });
});

async function updateProductDetails(productId) {
  const response = await fetch('./products.json');
  if (!response.ok) {
      console.error('Failed to load product data:', response.status);
      return;
  }

  const data = await response.json();
  const product = data.products.find(item => item.id === productId);

  const shopItem = document.querySelector('.shop-item'); 
  if (product) {
    if (shopItem) {
      shopItem.classList.add('fade-out'); 

      setTimeout(() => {
        const h2Element = document.querySelector('.shop-item h2');
        console.log(h2Element); 

        if (h2Element) { 
            h2Element.textContent = product.title;
            document.querySelector('.item-area img').src = product.image;
            document.querySelector('.item-text').textContent = product.description;
            document.querySelector('.item-price').textContent = product.price;
            document.querySelector('.about-item a').href = product.link;

            setTimeout(() => {
              shopItem.classList.remove('fade-out'); 
              shopItem.classList.add('show'); 
            }, 300); // Adjust to fade out time
        } else {
            console.error('h2 elements not found.');
        }
      }, 300); // Wait a moment and update the content
    }
  } else {
      console.warn('Specified product not found:', productId);
  }
}

// When the page loads
window.onload = async () => {
  await Promise.all([
    loadTemplate('./components/header.html', 'header-template', 'header-placeholder'),
    loadTemplate('./components/footer.html', 'footer-template', 'footer-placeholder')
  ]);

  setupMenuToggle();

  // Get the product ID from the URL and update the content
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product') || '1';  // default
  
  await updateProductDetails(productId);  // Initial display of product information
};

// Processing to support the back button
window.onpopstate = async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product') || '1';  // default

  await updateProductDetails(productId);
};


function setupMenuToggle() {
  const $button = document.querySelector('.toggle-menu-button');
  const $menu = document.querySelector('.header-site-menu');

  if ($button && $menu) {
      $button.addEventListener('click', function () {
          $menu.classList.toggle('is-show');
      });
  } else {
      console.warn("Can't find the toggle button or menu.");
  }
}



