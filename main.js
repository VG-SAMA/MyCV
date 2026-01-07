const year = document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById("cvForm");
const submitBtn = document.getElementById('emailAddSubmit') 
const emailInput = document.getElementById('userEmail');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmailhandler();
});

//Code run by even listener for the form, and calls the api call to send email
async function sendEmailhandler(){
    submitBtn.disabled = true;
    const originalBtnHtml = submitBtn.innerHTML
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;

    await emailPost()
    form.reset()
    submitBtn.innerHTML = originalBtnHtml
    submitBtn.disabled = false;

}


async function emailPost() {
    try {
        const emailEndPoint = 'http://127.0.0.1:8000/api/sendemail'
        const emailAdd = document.getElementById('userEmail').value.trim()

        if (!emailAdd) {
            displayMessage('Email is required', 'danger');
            return
        }
    
        const sendData = new EmailPost(emailAdd)
        const response = await fetch(emailEndPoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendData)
        })

        let result
        try {
            result = await response.json()
        } catch {
            result = null
        }

        if (!response.ok) {
            let message = 'Something went wrong'

            if (result) {
                if (typeof result.detail === 'string') {
                    message = result.detail
                } else if (Array.isArray(result.detail)) {
                    message = result.detail.map(e => e.msg).join(', ')
                }
            }

            throw new Error(message)
        }

        displayMessage(
            `✅ Status ${result.status}, Message ${result.message}`
            
        );

    } catch (error) {
        console.error(error)
        displayMessage(error.message, 'danger', 10000)
    }
}


function displayMessage(message, type = "success", timeout = 5000) {
    const alertBox = document.getElementById("responseAlert");
    const alertMsg = document.getElementById("responseMessage");

    // Set the alert content and type
    alertBox.className = `alert alert-${type} alert-dismissible fade show`;
    alertMsg.textContent = message;

    // Make  visible
    alertBox.hidden = false;

    // Auto-hide after 'timeout' milliseconds
    setTimeout(() => {
        alertBox.classList.remove("show");
        alertBox.classList.add("fade"); // Optional: triggers fade-out
        alertBox.hidden = true;
    }, timeout);
}



class EmailPost{
    constructor(emailAddress){
        this.email_address = emailAddress
    }
}