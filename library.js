
// Create a library of books


const addBookDisplay = document.querySelector('#add-book-modal');

let library = [];

// Create constructor for book

function Book(title, author, pages, type, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.type = type;
    this.hasRead = hasRead;


}

function addBookToLibrary(book){

    library.push(book);
}


function getBookIndexFromLibrary(book){
    return library.indexOf(book)
}


function removeBookFromLibrary(index){
    library.splice(index, 1)
    clearLibrary();
    displayLibrary();
}

function clearLibrary(){
    const myLibrary = document.querySelector('#booklist');
    while (myLibrary.firstChild) {
        myLibrary.removeChild(myLibrary.lastChild);
    }
}

function showDisplayPrompt(){

}

// Create a modal pop-up for user to add books to a library


// Display library in a grid



//////// Test books /////
const Fellowship = new Book("Fellowship of the Ring", "J.R.R. Tolkien", 423, "fiction", false);

const Dune = new Book("Dune", "Frank Herbert", 412, "fiction", true);

const OryxCrake = new Book("Oryx and Crake", "Margaret Atwood", 400, "fiction", true);

addBookToLibrary(Dune);
addBookToLibrary(OryxCrake);
addBookToLibrary(Fellowship);

function displayLibrary(){

    let myLibrary = document.querySelector('#booklist');
    

    
    for (let book in library){
        
        
        // Create a book element for library
        const story = document.createElement("li");
        setAttributes(story, {"class": `book`, "id": `book${book}`, "data-library-index": `${book}`});
        
        // Attach attributes
        addAttributeToBook(library[book].title, 'h3', story)
        addAttributeToBook(library[book].author, 'p', story)
        addAttributeToBook(library[book].pages, 'p', story)
        addAttributeToBook(library[book].type, 'p', story)
        addAttributeToBook(library[book].hasRead, 'div', story)
  
        const removeBtn = document.createElement("input");
        setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});
        
       
        story.appendChild(removeBtn);
        myLibrary.appendChild(story);
    }

}

displayLibrary();
removeBookFromLibrary(Dune);

const removeBook = document.querySelectorAll(".remove-button");
removeBook.forEach(button => {
    console.log(button);
    button.addEventListener('click', () => {
        console.log('click')
        removeBookFromLibrary(button.parentNode.getAttribute("data-library-index"))
    });

});

const addBook = document.querySelector("#add-book");
    addBook.addEventListener("click", () => {
        console.log(addBookDisplay)
        addBookDisplay.style.display = "block";

    });


// Helper functions

// Add an element to target DOM (in this case a book attribute);
function addAttributeToBook(attributeType, targetElement, book){
    
    const attribute = document.createElement(`${targetElement}`);
    attribute.textContent = attributeType;
    book.appendChild(attribute);

}

// Set multible attributes at once
function setAttributes(element, attributes)
{
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    });
}
