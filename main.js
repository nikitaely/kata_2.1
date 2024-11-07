class View {
    constructor() {
        this.app = document.getElementById('app')

        this.title
        this.search = this.createElement('div', 'search');
        this.searchInput = this.createElement('input', 'search-input')
        this.reposList = this.createElement('ul', 'repos-list')
        
        this.addReposList = this.createElement('div', 'add-repos-list')

        this.search.append(this.searchInput)
        this.search.append(this.reposList)
        

        this.app.append(this.search)
        this.app.append(this.addReposList)
        
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);

        if (elementClass){
            element.classList.add(elementClass)
        }
        return element
    }

    createRepos(reposData) {
        const reposElement = this.createElement('li', 'repos');
        reposElement.textContent = reposData.name
        this.reposList.append(reposElement)

    }

    addRepos(reposData) {
        const reposElement = this.createElement('div', 'add-repos')
        const container = this.createElement('div', 'container')
        const name = this.createElement('div', 'text')
        name.textContent = `Name: ${reposData.name}`
        const owner = this.createElement('div', 'text')
        owner.textContent = `Owner: ${reposData.owner.login}`
        const stars = this.createElement('div', 'text')
        stars.textContent = `Stars: ${reposData.stargazers_count}`
        const button = this.createElement('button', 'remove')
        

        container.append(name)
        container.append(owner)
        container.append(stars)
        reposElement.append(container)
        reposElement.append(button)
        this.addReposList.append(reposElement)
        this.searchInput.value = ""; // Очищаем поле ввода
        this.reposList.innerHTML = ""; // Очищаем список автокомплита
    }




}

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 300))
        this.view.reposList.addEventListener('click', this.searchReposInfo.bind(this))
        this.view.addReposList.addEventListener('click', (event) => {
            
            if (event.target.className == 'remove') {
                event.target.parentNode.remove()
            }
        })
        this.m = {}
    }

    async searchRepos() {
        const query = this.view.searchInput.value.trim(); // Убираем лишние пробелы
        if (query === "") {
            this.view.reposList.innerHTML = ""; 
            return; 
        }
    
        return await fetch(`https://api.github.com/search/repositories?q=${query}`)
            .then((res) => {
                if (res.ok) {
                    res.json().then((res) => {
                        this.view.reposList.innerHTML = ""; // Очистить старые результаты
                        this.m = {}; // Очистить кэш
                        res.items.slice(0, 5).forEach((repos) => this.view.createRepos(repos));
                        for (let item of res.items.slice(0, 5)) {
                            let name = item.name;
                            this.m[name] = item;
                        }
                    });
                }
            });
    }
    
    searchReposInfo(event) {
        if (event.target.closest('.repos')) {
            this.view.addRepos(this.m[event.target.textContent])
        }
        
    }

    debounce (fn, debounceTime) {
        let timeout;
        return function() {
            const fnCall = () => {fn.apply(this, arguments)}
    
            clearTimeout(timeout)
            
            timeout = setTimeout(fnCall, debounceTime)
        }
    };

    

    


}


new Search(new View());

