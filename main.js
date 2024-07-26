//main.js
document.addEventListener('DOMContentLoaded', () => {
    function loadFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            fetch('./includes/footer.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    footerContainer.innerHTML = data;
                })
                .catch(error => console.error('Error loading footer:', error));
        }
    }
    function loadNavbar(){
        const navbarContainer = document.getElementById("navbar-container")
        if(navbarContainer){
            fetch("./includes/navbar.html")
            .then(response => {
                if(!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.text()
            })
            .then(data => {
                navbarContainer.innerHTML = data
            })
            .catch(error => console.error("Error loading header: ", error))
        }
    }
    
    loadNavbar()
    loadFooter()
})