/** ブラウザ側の最小スクリプト: 削除確認とトースト閉じる動作のみ。 */
(function () {
  'use strict';

  // 削除確認: data-confirm 属性を持つフォームを submit する直前に確認する。
  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    if (!(form instanceof HTMLFormElement)) return;
    var msg = form.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) {
      ev.preventDefault();
    }
  });

  // トーストの閉じるボタン
  document.addEventListener('click', function (ev) {
    var target = ev.target;
    if (target && target.classList && target.classList.contains('toast__close')) {
      var toast = target.closest('.toast');
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }
  });

  // 成功系トーストは 3 秒で自動非表示
  window.addEventListener('DOMContentLoaded', function () {
    var successToasts = document.querySelectorAll('.toast--success');
    successToasts.forEach(function (t) {
      setTimeout(function () {
        if (t && t.parentNode) t.parentNode.removeChild(t);
      }, 3000);
    });
  });
})();
