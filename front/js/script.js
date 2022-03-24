
async function get() {
    const response = await fetch("http://localhost:3000/api/products")
    const data = await response.json()
    console.log(data)

    for (let i = 0; i < data.length; i++) {

        //cree <a>
        const new_a = document.createElement("a");
        let elt = document.getElementById("items");
        elt.appendChild(new_a);
        new_a.href = `product.html?id=${data[i]._id}`

        //cree <article>
        const article = document.createElement("article")
        new_a.appendChild(article)

        //cree image
        const photo = document.createElement("img")
        article.appendChild(photo)
        photo.src = data[i].imageUrl

        //cree titre
        const titre_3 = document.createElement("h3")
        article.appendChild(titre_3)
        titre_3.innerHTML = data[i].name

        //cree description
        const text = document.createElement("p")
        article.appendChild(text)
        text.innerHTML = data[i].description


    }
}

get()
