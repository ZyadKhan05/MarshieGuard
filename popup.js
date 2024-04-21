document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const loading = document.getElementById('loader');
    const badImage = document.getElementById('sad'); 
    const happyImage = document.getElementById('happy'); 
    const outerCharacter = document.getElementById('outer-character'); 
    const marshy = document.getElementById('marsh');
    const engaging = document.getElementById('engaging');
    const resultEmailDiv = document.getElementById('result2');

    checkButton.addEventListener('click', function() {
        resultDiv.textContent = "";
        resultEmailDiv.textContent = ''; 

        const url = urlInput.value.trim();
        outerCharacter.style.backgroundImage = "url('images/LoadingIdle.gif')";
        marshy.classList.add('hide');
        engaging.classList.remove('hide');
        engaging.src = "images/engaging.gif"; 
        resultDiv.style.color = 'orange'; 
        resultDiv.style.fontSize = '20px'; 
    
        if (url !== '') {
            chrome.runtime.sendMessage({url: url}, function(response) {
                engaging.classList.add('hide');
                outerCharacter.style.backgroundImage = "url('images/campfire_bg.png')";

                if (response) {
                    if (response.positives > 0) {
                        resultDiv.textContent = `Detected: ${response.positives}, Total: ${response.total}`;

                        marshy.src = "images/MarshyMelted.gif";
                        marshy.style.position = 'absolute';
                        marshy.style.left = '50%';
                        marshy.style.top = '50%';
                        marshy.style.transform = 'translate(-50%, -50%) scale(3.2)';
                        marshy.classList.remove('hide');
                        const marshyHeight = marshy.offsetHeight;
                        marshy.style.top = `calc(37% - ${marshyHeight / 2}px)`;
                    } else if (response.total > 0) {
                        resultDiv.textContent = `Detected: ${response.positives}, Total: ${response.total}`;

                        marshy.src = "images/MarshyFighting.gif";
                        marshy.style.position = 'absolute';
                        marshy.style.left = '50%';
                        marshy.style.top = '50%';
                        marshy.style.transform = 'translate(-50%, -50%) scale(3.3)';
                        marshy.classList.remove('hide');
                        const marshyHeight = marshy.offsetHeight;
                        marshy.style.top = `calc(34% - ${marshyHeight / 2}px)`;
                    } else {
                        resultDiv.textContent = 'He got lost [Failed]';
                    }
                    resultDiv.classList.remove('hide'); // Show the result text
                } else {
                    resultDiv.textContent = 'He got lost [Failed]';
                    badImage.style.display = 'none'; 
                    happyImage.style.display = 'none'; 
                }

                // Hide the loading screen after receiving the response
                loading.classList.add('hide');
            });
        }
    });
});
