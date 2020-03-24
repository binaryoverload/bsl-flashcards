$(async function () {

    let categoriesResponse = await fetch("prompts/categories")
    let categories = (await categoriesResponse.text()).trim().split("\n")

    categories.forEach(category => {
        $("#categories-list").append(`<button type="button" id="${category.toLowerCase()}" class="btn btn-info btn-md btn-block" data-toggle="button" aria-pressed="false">${titleCase(category)}</button>`)
    })

    let weeksResponse = await fetch("prompts/weeks")
    let weeks = (await weeksResponse.text()).trim().split("\n")

    weeks.forEach(week => {
        $("#weeks-list").append(`<button type="button" id="${week}"" class="btn btn-info btn-md btn-block" data-toggle="button" aria-pressed="false">Week ${week}</button>`)
    })

    $("#categories-btn").click(() => {
        let ids = $("#categories-list .active").map(function() { return this.id }).get().join()
        window.location = `/categories.html?categories=${ids}`
    })

    $("#weeks-btn").click(() => {
        let ids = $("#weeks-list .active").map(function() { return this.id }).get().join()
        window.location = `/weeks.html?weeks=${ids}`
    })

})