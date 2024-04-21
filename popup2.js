document.addEventListener('DOMContentLoaded', function() {
    const checkEmailButton = document.getElementById('checkButton2');
    const emailInput = document.getElementById('urlInput2');
    const resultEmailDiv = document.getElementById('result2');
    const resultDiv = document.getElementById('result');
    const resultLoader = document.getElementById('loader2');
    const outerCharacter = document.getElementById('outer-character'); 
    const marshy = document.getElementById('marsh');
    const engaging = document.getElementById('engaging');

    checkEmailButton.addEventListener('click', function() {
        resultDiv.textContent = "";
        resultEmailDiv.textContent = ''; 
        const email = emailInput.value.trim();
        outerCharacter.style.backgroundImage = "url('images/LoadingIdle.gif')";
        marshy.src = "images/MarshyLog.gif";
        marshy.classList.add('hide');
        engaging.classList.remove('hide');
        engaging.src = "images/engaging.gif"; 
        

        if (email !== '') {
            resultLoader.classList.remove('hide'); // Show the loader for the result
            chrome.runtime.sendMessage({ type: 'breachedAccount', email: email }, function(response) {
                outerCharacter.style.backgroundImage = "url('images/campfire_bg.png')";
                engaging.classList.add('hide');
                resultLoader.classList.add('hide'); // Hide the loader for the result
                if (response && response.breaches.length > 0) {
                    marshy.src = "images/MarshyMelted.gif";
                    marshy.style.position = 'absolute';
                    marshy.style.left = '50%';
                    marshy.style.top = '50%';
                    marshy.style.transform = 'translate(-50%, -50%) scale(3.2)';
                    marshy.classList.remove('hide');
                    const marshyHeight = marshy.offsetHeight;
                    marshy.style.top = `calc(37% - ${marshyHeight / 2}px)`;

                    resultEmailDiv.innerHTML = '<p>This account has been involved in the following breaches:</p>';
                    response.breaches.forEach(breach => {
                        resultEmailDiv.innerHTML += `<p>${breach.Name}</p>`;
                    });
                } else {
                    marshy.src = "images/MarshyFighting.gif";
                    marshy.style.position = 'absolute';
                    marshy.style.left = '50%';
                    marshy.style.top = '50%';
                    marshy.style.transform = 'translate(-50%, -50%) scale(3.2)';
                    marshy.classList.remove('hide');
                    const marshyHeight = marshy.offsetHeight;
                    marshy.style.top = `calc(34% - ${marshyHeight / 2}px)`;
                    resultEmailDiv.textContent = 'This account has not been involved in any known breaches.';
                }
            });
        }
    });
});
