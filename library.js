
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
  
        // Add a button to remove book from library
        const removeBtn = document.createElement("input");
        setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});  
        removeBtn.addEventListener('click', () => {
            removeBookFromLibrary(removeBtn.parentNode.getAttribute("data-library-index"))
        })
        story.appendChild(removeBtn);
        myLibrary.appendChild(story);
    }

}

displayLibrary();


const addBookPopUp = document.querySelector("#add-book");
    addBookPopUp.addEventListener("click", () => {

        addBookDisplay.style.display = "block";

    });

const addBook = document.querySelector('form');
console.log(addBook);


addBook.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addBook);
    const title = formData.get('book_title')
    const author = formData.get('author_name')
    const type = formData.get('book_type')
    const pages = formData.get('page_count')
    const read = formData.get('has_read')
    
    addBookToLibrary(new Book(title, author, pages, type, read));
    addBook.reset();
    clearLibrary();
    displayLibrary();

});
    
let testVar = ""
function submitBook(){
   
 
    
    
}


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