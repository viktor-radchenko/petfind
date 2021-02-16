// custom javascript

// replace emails in admin list model view with clickable links
window.onload = function () {
  let emails = document.querySelectorAll("td.col-email");
  console.log("THIS ARE EMAILS!", emails);

  emails.forEach((row) => {
    let link = `mailto:${row.innerText}`;
    row.innerHTML = `<a href="${link}">${row.innerText}</a>`;
  });
};
