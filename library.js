
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
        story.appendChild(addAttributeToBook(library[book].title, 'h3'));
        
        const author = addAttributeToBook("Author: ", 'div');
        author.appendChild(addAttributeToBook(library[book].author, 'p'));
        story.appendChild(author);
        
        const pages = addAttributeToBook("Pages: ", 'div')
        pages.appendChild(addAttributeToBook(library[book].pages, 'p'))
        story.appendChild(pages);

        const type = addAttributeToBook("Type: ", 'div');
        type.appendChild(addAttributeToBook(library[book].type, 'p'));
        story.appendChild(type);

        // Create container for 'Read' and 'Delete' buttons.
        const bookButtons = addAttributeToBook('Read?', 'div')
        setAttributes(bookButtons, {'class': `book-buttons }`})
       

        const hasRead = document.createElement('input');
        setAttributes(hasRead, {'type': 'button', 'class': `read-button ${(library[book].hasRead) && 'hasread'}`})
        hasRead.addEventListener('click', () => setBookReadStatus(hasRead, !library[book].hasRead))
        bookButtons.appendChild(hasRead);
  
        // Add a button to remove book from library
        const removeBtn = document.createElement("input");
        setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});  
        removeBtn.addEventListener('click', () => {
            removeBookFromLibrary(removeBtn.parentNode.getAttribute("data-library-index"))
        })
        bookButtons.appendChild(removeBtn);

        story.appendChild(bookButtons)

        myLibrary.appendChild(story);
    }

}


function setBookReadStatus(button, haveRead){
    console.log(haveRead, 'book');

    const index = getParentWith(button, 'book').getAttribute('data-library-index')

    library[index].hasRead = haveRead;
    haveRead ? button.classList.add('hasread') : button.classList.remove('hasread');
    console.log(library[index].hasRead)
}




displayLibrary();



const addBookPopUp = document.querySelector("#add-book");
    addBookPopUp.addEventListener("click", () => {

        addBookDisplay.style.display = "block";

    });

const addBook = document.querySelector('form');
console.log(addBook);


// Create book from user input
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
    








// Helper functions

// Add an element to target DOM (in this case a book attribute);
function addAttributeToBook(attributeType, targetElement, book){
    
    const attribute = document.createElement(`${targetElement}`);
    attribute.textContent = attributeType;  
    // Allow nesting if desired
    return attribute;

}

// Set multible attributes at once
function setAttributes(element, attributes)
{
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    });
}

// Search through parents for a specific element and return the node
// with that class
function getParentWith(node, nodeClass){
    console.log(nodeClass);
    console.log(node.className);
    // return if class not found in document
    if (node.parentNode.tagName == 'HTML'){
        console.warn("No DOM with that class")
        return;
    }
    
    if (node.parentNode.className == nodeClass) {
        return(node.parentNode);
    }
    return(getParentWith(node.parentNode, nodeClass));

}
