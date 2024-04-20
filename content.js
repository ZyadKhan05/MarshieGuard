// content.js

let linkUrl = "";
let hoverTimer = null;

document.addEventListener("mouseover", function(event) {
  let target = event.target;

  if (target.tagName.toLowerCase() === "a") {
    linkUrl = target.href;

    // Start timer when user hovers over a link
    hoverTimer = setTimeout(() => {
      chrome.runtime.sendMessage({ action: "hoverLink", url: linkUrl });
    }, 2000); // 2 seconds
  }
});

// Clear timer if user moves away from the link
document.addEventListener("mouseout", function(event) {
  clearTimeout(hoverTimer);
  linkUrl = "";
});
