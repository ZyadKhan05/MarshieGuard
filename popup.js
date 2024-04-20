document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const loading = document.getElementById('loader');
    const badImage = document.getElementById('sad'); 
    const happyImage = document.getElementById('happy'); 

    checkButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        loading.classList.remove('hide');
        if (url !== '') {
            chrome.runtime.sendMessage({url: url}, function(response) {
                loading.classList.add('hide');
                if (response) {
                    resultDiv.textContent = `Detected: ${response.positives}, Total: ${response.total}`;
                    if (response.positives > 0) {
                        badImage.style.display = 'block'; 
                        happyImage.style.display = 'none'; 
                    } else {
                        badImage.style.display = 'none';
                        happyImage.style.display = 'block'; 
                    }
                } else {
                    resultDiv.textContent = 'Failed to get scan results.';
                    badImage.style.display = 'none'; 
                    happyImage.style.display = 'none'; 
                }
            });
        }
    });
});
