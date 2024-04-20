document.addEventListener('DOMContentLoaded', function() {
    const checkEmailButton = document.getElementById('checkButton2');
    const emailInput = document.getElementById('urlInput2');
    const resultEmailDiv = document.getElementById('result2');
    const emailLoader = document.getElementById('loader2');


    checkEmailButton.addEventListener('click', function() {
        const email = emailInput.value.trim();
        emailLoader.classList.remove('hide');
        if (email !== '') {
            chrome.runtime.sendMessage({ type: 'breachedAccount', email: email }, function(response) {
                if (response && response.breaches.length > 0) {
                    resultEmailDiv.innerHTML = '<p>This account has been involved in the following breaches:</p>';
                    response.breaches.forEach(breach => {
                        resultEmailDiv.innerHTML += `<p>${breach.Name}</p>`;
                    });
                } else {
                    resultEmailDiv.textContent = 'This account has not been involved in any known breaches.';
                }
                emailLoader.classList.add('hide');
            });
        }
    });
});
