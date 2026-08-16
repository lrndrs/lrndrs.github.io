(function () {
  // Email is stored as character codes (not plain text) so static scrapers
  // reading page/JS source can't harvest it directly; it's only assembled
  // and inserted into the DOM at runtime.
  var codes = [101, 110, 100, 114, 101, 115, 64, 101, 97, 112, 115, 46, 101, 116, 104, 122, 46, 99, 104];
  var email = String.fromCharCode.apply(null, codes);

  document.querySelectorAll("[data-protected-email]").forEach(function (el) {
    var a = document.createElement("a");
    a.href = "mailto:" + email;
    a.textContent = email;
    el.replaceWith(a);
  });
})();
