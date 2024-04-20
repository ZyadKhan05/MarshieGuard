//adds the event listener to the entire website page. DOMContentLoaded refers to a process where the js
//only runs after all the html, css, etc. has run, so that the js doesn't encounter any issues
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOMContentLoaded event fired");

  // Select the target node to observe for mutations
  const targetNode = document.body;
  console.log("Target node:", targetNode);

  // Options for the observer (which mutations to observe)
  //childList is supposed to be checking for all the internal elements within the code, not just the parent
  //aka, sifting through the parent and all the children elements to check if a link exists.
  //subtree does something similar where the subtree essentially means to check all the descending elements
  //if set to true.
  const observerConfig = { childList: true, subtree: true };
  console.log("Observer configuration:", observerConfig);

  // Callback function to handle mutations. This checks to see if any changes have been made to the 
  //page which we don't currently have, in our case would be external links which we have not added.
  function handleMutations(mutationsList, oberver) {
    console.log("Handling mutations...");
    //this code essentially runs through all the mutations which have occurred, and checks whether
    //it is an <a> tag or is the same link domain as the current page.
      mutationsList.forEach(mutation => {
        console.log("Mutation:", mutation);
          mutation.addedNodes.forEach(node => {
            console.log("Added node:", node);
              // Check if the added node is an <a> element and if the current link is same as host link
              if (node.tagName === 'A' && node.hostname !== window.location.hostname) {
                console.log("External link detected:", node);
                  // Apply hover effect to the new link
                  applyHoverEffect(node);
              }
          })
      })
  }

  // Create a new observer instance
  const observer = new MutationObserver(handleMutations);
  console.log("Observer created:", observer);

  // Start observing the target node for mutations
  observer.observe(targetNode, observerConfig);
  console.log("Observer started observing mutations");


  // Function to apply hover effect to a link
  function applyHoverEffect(link) {
    console.log("Applying hover effect to link:", link);
    //if hovering over link, will add the hover-effect styling from the css
      link.addEventListener('mouseover', function() {
        console.log("Mouseover event detected on link:", link);
          link.classList.add('hover-effect');
      })
      //if no longer hovering over link, will remove the hover-effect styling from the element.
      link.addEventListener('mouseout', function() {
        console.log("Mouseout event detected on link:", link);
          link.classList.remove('hover-effect');
      })
  }
})
