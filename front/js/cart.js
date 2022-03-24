let panier = JSON.parse(localStorage.getItem("product")) || [];
//console.log(panier)


//ajouter les porduits dans panier + calcule total de prix

let totalprice = document.getElementById("totalPrice")
let prix_total = 0
for (let i = 0; i < panier.length; i++) {
  let prix_qantity = panier[i].quantity * panier[i].prix_kanap
  const html = `<article class="cart__item" data-id="${panier[i].id_kanape}" data-color="${panier[i].coleur_kanap}">
<div class="cart__item__img">
  <img src="${panier[i].image_kanap}" alt="Photographie d'un canapé">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${panier[i].name_kanap}</h2>
    <p>${panier[i].coleur_kanap}</p>
    <p>${prix_qantity} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier[i].quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article>`
  prix_total += prix_qantity
  let element_position = document.getElementById("cart__items");
  element_position.innerHTML += html;
}
//inserer prix total
totalprice.innerHTML = prix_total


// supprime produit

let btn_supprime = document.querySelectorAll(".deleteItem")
const el = document.querySelectorAll(".cart__item")
for (let i = 0; i < btn_supprime.length; i++) {

  btn_supprime[i].addEventListener("click", () => {
    //recuperer id + coleur de produit qui ont veux supprimer
    let suprim_id = el[i].dataset.id;
    let suprim_color = el[i].dataset.color
    if (panier.length == 1) {
      localStorage.removeItem("product")
      location.reload()
    } else {
      // panier = tous les produit sans le produit supprimer 
      panier = panier.filter(elt => elt.id_kanape !== suprim_id || elt.coleur_kanap !== suprim_color);
      localStorage.setItem("product", JSON.stringify(panier));
      console.log('Votre article a bien été supprimé.');
      location.reload()
    }
  }
  )
}



function modifier_quantity_produit() {
  let modifier_quantity = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < modifier_quantity.length; i++) {
    modifier_quantity[i].addEventListener("change", () => {
      //recuoerer quantite apres changer a partie de fichier html
      let noveau_quantity = modifier_quantity[i].valueAsNumber;
      //changer quantite de produit dans panier
      panier[i].quantity = noveau_quantity;

      localStorage.setItem("product", JSON.stringify(panier));

      // refresh rapide
      location.reload();
    })
  }
}
modifier_quantity_produit();

//total quantite produit
let total_pro = document.getElementById("totalQuantity")
total_pro.innerHTML = panier.length




//conformation order

const btnSubmit = document.getElementById("order")

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault(); // on bloque la soumission (attendre la validation)
  const formulaire = {
    firstName: {
      input: document.getElementById("firstName"),
      regex: /^[A-Za-z]{3,20}$/
    },
    lastName: {
      input: document.getElementById("lastName"),
      regex: /^[A-Za-z]{3,20}$/
    },
    address: {
      input: document.getElementById("address"),
      regex: /^[0-9A-Za-z\s]{5,50}$/
    },
    city: {
      input: document.getElementById("city"),
      regex: /^[A-Za-z]{3,20}$/
    },
    email: {
      input: document.getElementById("email"),
      regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    }
  }

  // //control formulaire
  function error(input) {
    if (input == "firstName" || input == "lastName" || input == "city") {
      const errorName = "chiffre et symoble ne sont pas autorise \ncaracteres entre 3 et 20"
      return errorName
    } else if (input == "address") {
      const errorAddresse = "address incorrect"
      return errorAddresse
    }
    else if (input == "email") {
      const errorEmail = "email incorrect"
      return errorEmail
    }
  }
  console.log(error("firstName"))
  console.log(error("address"))
  console.log(error("email"))

  function validate(input, regex) {
    // selectionner le champ error qui est a coté du champ que tu veux valider
    const el = document.getElementById(input.name)
    const fieldError = el.nextElementSibling


    if (regex.test(input.value)) {
      console.log("ok")
      fieldError.innerHTML = "";
      return true;
    } else {
      console.log("ko")
      fieldError.innerHTML = error(input.name);
      return false;
    }
  }



  let submitFormul = true
  for (const key in formulaire) {
    if (validate(formulaire[key].input, formulaire[key].regex)) {
      submitFormul &= true
    } else {
      submitFormul &= false
    }
  }
  const contact = {
    firstName: formulaire["firstName"].input.value,
    lastName: formulaire["lastName"].input.value,
    address: formulaire["address"].input.value,
    city: formulaire["city"].input.value,
    email: formulaire["email"].input.value
  }
  console.log(contact)


  let products = [];
  for (let i = 0; i < panier.length; i++) {
    products.push(panier[i].id_kanape);
  }
  console.log(products);


  const aEnvoyer = {
    contact,
    products,
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(aEnvoyer),//transformer aEnvoyer en json
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };

  console.log(submitFormul)// 1==true
  if (submitFormul == true && panier.length != 0) {
    console.log("formul valid")
    fetch("http://localhost:3000/api/products/order", options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        localStorage.setItem('orderId', data.orderId);
        document.location.href = 'confirmation.html?id=' + data.orderId;
      })
      .catch((error) => {
        console.error('Error:', error)
      })


  } else {
    console.log("formul non valid")
  }



})




