

        let weeks = []
        let words = {}

        $(async function () {

            let allWeeks = []

            let response = await fetch("prompts/weeks")
            allWeeks = (await response.text()).trim().split("\n");

            let searchParams = new URLSearchParams(window.location.search)
            if (searchParams.has('weeks') && searchParams.get("weeks")) {
                failedToFind = []
                searchParams.get("weeks").split(",").forEach(query => {
                    if (allWeeks.findIndex(item => query.toLowerCase() == item.toLowerCase()) == -1) {
                        console.error("Could not find the week: " + query)
                    } else {
                        weeks.push(query)
                    }
                })
            } else {
                weeks = allWeeks
            }

            for (let week of weeks) {

                let response = await fetch(`prompts/wk-${week}.csv`)
                let retrievedWords = (await response.text()).trim().split("\n");

                for (let word of retrievedWords) {
                    let elements = word.split(",")
                    words[elements[0].toLowerCase()] = {
                        video: elements[1],
                        description: elements[2]
                    }
                }
            }

            $("#weeks-list").text(weeks.map(item => `Week ${item}`).join(", "));
        })

        $("#refresh").click(() => {
            let keys = Object.keys(words);
            let randomWord = keys[Math.floor(keys.length * Math.random())]
            let wordDisplay = randomWord.charAt(0).toUpperCase() + randomWord.slice(1)

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
    