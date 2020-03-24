
        let categories = []
        let words = {}

        $(async function () {

            let allCategories = []

            let response = await fetch("prompts/categories")
            allCategories = (await response.text()).trim().split("\n");

            let searchParams = new URLSearchParams(window.location.search)
            if (searchParams.has('categories') && searchParams.get("weeks")) {
                failedToFind = []
                searchParams.get("categories").split(",").forEach(query => {
                    if (allCategories.findIndex(item => query.toLowerCase() == item.toLowerCase()) == -1) {
                        console.error("Could not find the category: " + query)
                    } else {
                        categories.push(query)
                    }
                })
            } else {
                categories = allCategories
            }

            for (let category of categories) {

                let response = await fetch(`prompts/cat-${category}.csv`)
                let retrievedWords = (await response.text()).trim().split("\n");

                for (let word of retrievedWords) {
                    let elements = word.split(",")
                    words[elements[0].toLowerCase()] = {
                        video: elements[1],
                        description: elements[2]
                    }
                }
            }

            $("#categories-list").text(categories.map(titleCase).join(", "));

        })

        $("#refresh").click(() => {
            let keys = Object.keys(words);
            let randomWord = keys[Math.floor(keys.length * Math.random())]
            let wordDisplay = titleCase(randomWord)

            $("#sign").html(`
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">${wordDisplay}</h5>
                        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#videoCollapse" aria-expanded="false" aria-controls="videoCollapse">
                            Toggle Video
                        </button>
                        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#hintCollapse" aria-expanded="false" aria-controls="hintCollapse">
                            Toggle Hint
                        </button>
                        <div class="collapse mt-3 p-2" id="hintCollapse">
                            <h6 class="card-subtitle mb-2 text-muted">${words[randomWord].description || ""}</h6>
                        </div>
                        <div class="collapse p-2" id="videoCollapse">
                            <video controls src=${words[randomWord].video} style="max-width: 100%;"/>
                        </div>
                    </div>
                </div>
            `)
        });