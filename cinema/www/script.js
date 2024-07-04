(() => {
    window.onload = () => {
        const addBtn = document.querySelector('.dashboard>.header>.add-btn');
        const movieTitleElement = document.querySelector('.dashboard>.header>.movie-title');
        const movieDescriptionElement = document.querySelector('.dashboard>.header>.movie-description');

        const loginBtn = document.querySelector('.loginform-container>.loginform>.login-btn');
        const socket = io();
        socket.emit("get-movies");
        
        loginBtn.addEventListener('click', () => {
            const username = document.querySelector('.loginform-container>.loginform>.username').value;
            const password = document.querySelector('.loginform-container>.loginform>.password').value;
            socket.emit("login", { username, password });
        });

        
        addBtn.addEventListener('click', () => {
            const movieTitle = movieTitleElement.value;
            const movieDescription = movieDescriptionElement.value;

            if (movieTitle && movieDescription) {
                socket.emit('add-movie', { movieTitle, movieDescription });
            }
            movieTitleElement.value = "";
            movieDescriptionElement.value = "";
            socket.emit("get-movies");
        });

        socket.on("movies", (movies) => {
            const moviesContainer = document.querySelector('.dashboard>.movies-container');
            moviesContainer.innerHTML = "";
            
            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-info');
                movieElement.setAttribute("movie-title", movie.movieTitle);
                
                movieElement.innerHTML = `
                <h3>${movie.movieTitle}</h3>
                <p>${movie.movieDescription}</p>
                <button class="delete-btn">Delete</button>
                `;
                moviesContainer.appendChild(movieElement);
                
                const deletebtn = moviesContainer.querySelector(`.movie-info[movie-title="${movie.movieTitle}"]>.delete-btn`)
                if(deletebtn)
                    deletebtn.addEventListener('click', () => {
                        socket.emit('delete-movie', movies.indexOf(movie));
                        socket.emit("get-movies");
                });
            });
        });


        socket.on("isLogged", (isLogged) => {
            if (isLogged){
                document.querySelector('.loginform-container').style.display = "none";
                document.querySelector('.dashboard').classList = "dashboard";
            }
            else{
                alert("Error: Invalid credentials!")
            }
        });

        socket.on("newFilm", (filmData) => {
            alert("C'è un nuovo film!\n" + filmData.movieTitle + " " + filmData.movieDescription);
        });
    }
})()