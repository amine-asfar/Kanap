

var urlcourante = window.location.href;
var url = new URL(urlcourante);
var search_params = new URLSearchParams(url.search);

if (search_params.has('id')) {
    var id = search_params.get('id');
    console.log(id)
}
async function get() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const data = await response.json()
    console.log(data)

    //inserer 

    let photo_logo = document.createElement("img")
    let elt_1 = document.querySelector(".item__img");
    elt_1.appendChild(photo_logo)
    //photo_logo.src = "../images/logo.png";
    photo_logo.src = data.imageUrl

    let title = document.getElementById("title")
    title.innerHTML = data.name

    let prix = document.getElementById("price")
    prix.innerHTML = data.price

    let description = document.getElementById("description")
    description.innerHTML = data.description

    for (let i in data.colors) {
        let opt = document.createElement("option")
        let elt_2 = document.getElementById("colors")
        elt_2.appendChild(opt)
        opt.value = data.colors[i]
        opt.innerHTML = data.colors[i]

    }
    let btn_addproduit = document.getElementById("addToCart");
    btn_addproduit.addEventListener('click', function () {
        ajouter_produit(data)
    })
}

get()




function ajouter_produit(data) {


    let produit = {
        id_kanape: id,
        coleur_kanap: document.getElementById("colors").value,
        quantity: document.getElementById("quantity").value,
        image_kanap: data.imageUrl,
        prix_kanap: data.price,
        name_kanap: data.name

    }



    //JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
    //JSON.parse() takes a JSON string and transforms it into a JavaScript object.
    let panier = JSON.parse(localStorage.getItem("product"))





    if (panier) {

        for (let i = 0; i < panier.length; i++) {
            //if produit deja exist dans panier
            if (produit.id_kanape == panier[i].id_kanape && produit.coleur_kanap == panier[i].coleur_kanap) {
                return (
                    panier[i].quantity = parseInt(panier[i].quantity) + parseInt(produit.quantity),
                    console.log("produit exist , ajouter quantity"),
                    localStorage.setItem("product", JSON.stringify(panier)),
                    (panier = JSON.parse(localStorage.getItem("product")))

                );

            } else if ((produit.id_kanape == panier[i].id_kanape && produit.coleur_kanap != panier[i].coleur_kanap) ||
                produit.id_kanape != panier[i].id_kanape) {
                if (produit.quantity == 0) {
                    alert("quantity 0 prouduit non ajouter")
                } else {
                    return (
                        console.log("produit exist dans panier mais autre coleur ou noveau produit"),
                        panier.push(produit),
                        localStorage.setItem("product", JSON.stringify(panier))
                    );
                }
            }


        }
    } else {
        if (produit.quantity == 0) {
            alert("quantity 0 prouduit non ajouter")
        } else {
            console.log("panier vide")
            panier = []
            panier.push(produit)
            localStorage.setItem("product", JSON.stringify(panier));
            console.log(panier)
        }
    }
}

