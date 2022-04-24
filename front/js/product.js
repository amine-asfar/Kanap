

var urlcourante = window.location.href;
var url = new URL(urlcourante);
var searchParams = new URLSearchParams(url.search);

if (searchParams.has('id')) {
    var id = searchParams.get('id');
    //console.log(id)
}
async function get() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const data = await response.json()


    //inserer 

    let photoLogo = document.createElement("img")
    let elt1 = document.querySelector(".item__img");
    elt1.appendChild(photoLogo)

    photoLogo.src = data.imageUrl

    let title = document.getElementById("title")
    title.innerHTML = data.name

    let prix = document.getElementById("price")
    prix.innerHTML = data.price

    let description = document.getElementById("description")
    description.innerHTML = data.description

    for (let i in data.colors) {
        let opt = document.createElement("option")
        let elt2 = document.getElementById("colors")
        elt2.appendChild(opt)
        opt.value = data.colors[i]
        opt.innerHTML = data.colors[i]

    }
    let btnAddproduit = document.getElementById("addToCart");
    btnAddproduit.addEventListener('click', function () {
        addProduct(data)

    })
}

get()




function addProduct(data) {


    let produit = {
        idKanape: id,
        colorKanap: document.getElementById("colors").value,
        quantity: document.getElementById("quantity").value,
        imageKanap: data.imageUrl,
        prixKanap: data.price,
        nameNanap: data.name

    }



    //JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
    //JSON.parse() takes a JSON string and transforms it into a JavaScript object.
    let basket = JSON.parse(localStorage.getItem("product")) || []





    if (basket && basket.length) {
        if (produit.quantity == 0) {
            alert("quantity 0 prouduit non ajouter")
        }
        else if (produit.colorKanap == "") {
            alert("choisissez une couleur")
        } else {
            for (let i = 0; i < basket.length; i++) {

                //if produit deja exist dans basket
                if (produit.idKanape == basket[i].idKanape && produit.colorKanap == basket[i].colorKanap) {
                    return (
                        basket[i].quantity = parseInt(basket[i].quantity) + parseInt(produit.quantity),
                        console.log("produit exist , ajouter quantity"),
                        localStorage.setItem("product", JSON.stringify(basket)),
                        (basket = JSON.parse(localStorage.getItem("product"))),
                        alert("produit ajouter")

                    );
                }
            }
            for (let i = 0; i < basket.length; i++) {
                if ((produit.idKanape == basket[i].idKanape && produit.colorKanap != basket[i].colorKanap) || (produit.idKanape != basket[i].idKanape)) {
                    return (
                        console.log("produit exist dans basket mais autre coleur ou noveau produit"),
                        basket.push(produit),
                        localStorage.setItem("product", JSON.stringify(basket)),
                        alert("produit ajouter")
                    );
                }
            }

        }
    } else {
        if (produit.quantity == 0) {
            alert("quantity 0 prouduit non ajouter")
        }
        else if (produit.colorKanap == "") {
            alert("choisissez une couleur")
        }
        else {
            //console.log("basket vide")
            basket = []
            basket.push(produit)
            localStorage.setItem("product", JSON.stringify(basket));
            alert("produit ajouter")
            //console.log(basket)
        }
    }

}
