let basket = JSON.parse(localStorage.getItem("product")) || [];
//console.log(basket)


//ajouter les porduits dans basket + calcule total de prix

let totalprice = document.getElementById("totalPrice")
let prixTotal = 0
for (let i = 0; i < basket.length; i++) {
  let prixQantity = basket[i].quantity * basket[i].prixKanap
  const html = `<article class="cart__item" data-id="${basket[i].idKanape}" data-color="${basket[i].colorKanap}">
<div class="cart__item__img">
  <img src="${basket[i].imageKanap}" alt="Photographie d'un canapé">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${basket[i].nameNanap}</h2>
    <p>${basket[i].colorKanap}</p>
    <p>${prixQantity} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[i].quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article>`
  prixTotal += prixQantity
  let elementPosition = document.getElementById("cart__items");
  elementPosition.innerHTML += html;
}
//inserer prix total
totalprice.innerHTML = prixTotal


// supprime produit

let btnSupprime = document.querySelectorAll(".deleteItem")
const el = document.querySelectorAll(".cart__item")
for (let i = 0; i < btnSupprime.length; i++) {

  btnSupprime[i].addEventListener("click", () => {
    //recuperer id + coleur de produit qui ont veux supprimer
    let deletId = el[i].dataset.id;
    let deletColor = el[i].dataset.color
    if (basket.length == 1) {
      localStorage.removeItem("product")
      location.reload()
    } else {
      // basket = tous les produit sans le produit supprimer 
      basket = basket.filter(elt => elt.idKanape !== deletId || elt.colorKanap !== deletColor);
      localStorage.setItem("product", JSON.stringify(basket));
      console.log('Votre article a bien été supprimé.');
      location.reload()
    }
  }
  )
}



function modifierQuantityProduit() {
  let changeQuantity = document.querySelectorAll(".itemQuantity");


  for (let i = 0; i < changeQuantity.length; i++) {
    const input = changeQuantity[i]
    input.addEventListener("change", () => {
      const article = input.closest("article")

      //recuoerer quantite apres changer a partie de fichier html
      let newQuantity = input.valueAsNumber;
      if (newQuantity == 0) {
        basket = basket.filter(elt => {
          return elt.idKanape !== article.dataset.id || elt.colorKanap !== article.dataset.color
        });
        localStorage.setItem("product", JSON.stringify(basket));
      } else {


        //changer quantite de produit dans basket
        basket[i].quantity = newQuantity;

      }
      console.log(basket)
      localStorage.setItem("product", JSON.stringify(basket));
      // refresh rapide
      location.reload();

    })
  }
}
modifierQuantityProduit();

//total quantite produit
let totalPro = document.getElementById("totalQuantity")
totalPro.innerHTML = basket.length




//conformation order

const btnSubmit = document.getElementById("order")

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault(); // on bloque la soumission (attendre la validation)
  const formulaire = {
    firstName: {
      input: document.getElementById("firstName"),
      regex: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]{3,20}$/
    },
    lastName: {
      input: document.getElementById("lastName"),
      regex: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]{3,20}$/
    },
    address: {
      input: document.getElementById("address"),
      regex: /^[0-9A-Za-zÀ-ÖØ-öø-ÿ-\s]{5,50}$/
    },
    city: {
      input: document.getElementById("city"),
      regex: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]{3,20}$/
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
  for (let i = 0; i < basket.length; i++) {
    products.push(basket[i].idKanape);
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
  if (submitFormul == true && basket.length != 0) {
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




