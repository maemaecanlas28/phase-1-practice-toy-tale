let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

  // Button ID 
  const addBtn = document.querySelector("#new-toy-btn");

  // Div container to create a new toy;
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      // Show the toy form container
      toyFormContainer.style.display = "block"; 
    } else {
      // hide the toy form container
      toyFormContainer.style.display = "none"; 
    }
  });
  // Calling loadAllToys fx to fetch all the toys;
  loadAllToys();
});


// Fetch: GET --> retrieve
function loadAllToys () {
 //establish configObj
  const configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
  // response from fetch; make a new forEach loop (toy, addToyToDOM);
  fetch("http://localhost:3000/toys", configObj)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    // 1st parameter: one whole index, 2nd parameter: function that takes in the 1st parameter as an argument
    data.forEach(addToyToDOM); 
  })
}


// Helper fx to add toys to DOM; toy is an object.
 function addToyToDOM (toy) {

  // create a "div" for toy card
  const div = document.createElement("div");
  div.classList.add("card");

  // create "h2"
  const h2 = document.createElement("h2")
  // add textContent to "h2"
  h2.textContent = toy.name;
  // append "h2" to div.
  div.append(h2);

  // create "img"
  const img = document.createElement("img")
  // add src + class name
  img.src = toy.image
  img.classList.add("toy-avatar");
  // append "img" to div.
  div.append(img);

  // create "p" for likes
  const p = document.createElement("p");
  // add textContent to "p"
   p.textContent = `${toy.likes} likes`;
   p.setAttribute("id", `toy_likes_${toy.id}`)
  // append to div.
  div.append(p);

  // create "like button"
  const btn = document.createElement("button")
  // add class name and id to "button"
  btn.classList.add("like-btn");
  btn.setAttribute("id", toy.id);
  btn.textContent = "Likes ❤️";
  // append to div
  div.append(btn);

  btn.addEventListener("click", e => {
      likeToy(toy); // --> addEventListener only passes (e)
  })

  // append div to toy-collection div
  document.getElementById("toy-collection").append(div);
}

// override the default "submit" button behavior
const newToyID = document.getElementById("toy-form")
newToyID.addEventListener("submit", e => {
  e.preventDefault();
  addNewToy();
  console.log("hello")
});

// Fetch: POST --> add
function addNewToy () {
  // Get the values in the "form": name, image, likes
  // either use form.element or e.target
  const form = document.getElementsByClassName("add-toy-form")[0];
  let items = {
      name: form.elements.name.value,
      image: form.elements.image.value,
      likes: 0,
  }
  console.log(items);


  // establish configObj
    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(items)
    }

  fetch("http://localhost:3000/toys", configObj)
  .then(res => res.json())
  // passing in the addToyToDOM fx that should be called
  .then(addToyToDOM) 

}


// Fetch: PATCH --> update; when triggered to a specific toy(w/ id)
function likeToy (toy) {
  const toyID = toy.id
  const newNumberofLikes = toy.likes + 1;

  // establish configObj
    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
            "likes": newNumberofLikes

    })
    }

  fetch(`http://localhost:3000/toys/${toyID}`, configObj)
  .then(res => res.json)
  .then(item => {
    document.getElementbyID(`toy_likes_${item.id}`).textContent = newNumberofLikes;
 })
}
