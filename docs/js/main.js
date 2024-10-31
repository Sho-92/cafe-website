async function loadTemplate(url, templateId, placeholderId) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`ネットワークエラー: ${response.status}`);
  }
  
  const text = await response.text();

  // div要素にテンプレートを挿入
  const div = document.createElement('div');
  div.innerHTML = text;

  // 必要なテンプレートを取得
  const template = div.querySelector(`#${templateId}`);
  // プレースホルダーに挿入
  document.getElementById(placeholderId).innerHTML = template.innerHTML;
}

// ページが読み込まれたらヘッダーとフッターを挿入
// 商品リストのリンクにクリックイベントを追加
document.querySelectorAll('.shop-menu-inner a').forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault(); // デフォルトのリンク動作をキャンセル

    const productId = new URL(event.target.href).searchParams.get('product'); // クリックされたリンクから商品IDを取得
    console.log("クリックされた商品ID:", productId);

    // ここで商品情報を更新する関数を呼び出す
    await updateProductDetails(productId);
    
    // URLを更新
    history.pushState(null, '', event.target.href);
  });
});

// 商品情報を更新する関数
async function updateProductDetails(productId) {
  const response = await fetch('./products.json');
  if (!response.ok) {
      console.error('商品データの読み込みに失敗しました:', response.status);
      return;
  }

  const data = await response.json();
  const product = data.products.find(item => item.id === productId);

  const shopItem = document.querySelector('.shop-item'); // shop-itemの要素を取得
  if (product) {
    if (shopItem) {
      shopItem.classList.add('fade-out'); // フェードアウトを開始

      // 一瞬待ってから内容を更新
      setTimeout(() => {
        const h2Element = document.querySelector('.shop-item h2');
        console.log(h2Element); // h2要素を表示

        if (h2Element) { // h2が存在するか確認
            h2Element.textContent = product.title;
            document.querySelector('.item-area img').src = product.image;
            document.querySelector('.item-text').textContent = product.description;
            document.querySelector('.item-price').textContent = product.price;
            document.querySelector('.about-item a').href = product.link;

            // フェードアウトが完了した後にフェードイン
            setTimeout(() => {
              shopItem.classList.remove('fade-out'); // フェードアウトを解除
              shopItem.classList.add('show'); // 不透明にするクラスを追加
            }, 300); // フェードアウトの時間に合わせる
        } else {
            console.error('h2要素が見つかりません。');
        }
      }, 300); // 少し待ってから内容を更新
    }
  } else {
      console.warn('指定された商品が見つかりません:', productId);
  }
}

// ページが読み込まれた際の処理
window.onload = async () => {
  await Promise.all([
    loadTemplate('./components/header.html', 'header-template', 'header-placeholder'),
    loadTemplate('./components/footer.html', 'footer-template', 'footer-placeholder')
  ]);

  // トグル機能を設定
  setupMenuToggle();

  // URLから商品IDを取得して内容を更新
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product') || '1';  // デフォルトで商品IDを指定
  
  await updateProductDetails(productId);  // 商品情報を初期表示
};

// 戻るボタンに対応するための処理
window.onpopstate = async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product') || '1';  // デフォルトで商品IDを指定

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
      // このエラーメッセージを削除するか、警告に変える
      console.warn("トグルボタンまたはメニューが見つかりません。");
  }
}



