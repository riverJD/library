// References for repeated use
const addBookDisplay = document.querySelector('#book-modal-container');
const myLibrary = document.querySelector('#booklist');
const deleteConfirmScreen = document.querySelector('#delete-book-modal');
const resetConfirmScreen = document.querySelector('#reset-library-modal');

// Main array to store book bojects
let library = [];

// Track and update stats for header table
let stats = {
    totalPages: 0,
    pagesRead: 0,
    totalBooks: 0,
    booksRead: 0,
    authors: [],
    favAuthor: 'none',

    refresh: function(){

        let statsBooks = document.querySelector('#stats-books');
        let statsBooksRead = document.querySelector('#stats-books-read');
        let statsPages = document.querySelector('#stats-pages');
        let statsPagesRead = document.querySelector('#stats-pages-read');

        statsBooks.textContent = this.totalBooks;
        statsBooksRead.textContent = this.booksRead;
        statsPages.textContent = this.totalPages;
        statsPagesRead.textContent = this.pagesRead;
    },


    reset: function(){
        this.totalPages = 0;
        this.pagesRead = 0;
        this.totalBooks = 0;
        this.booksRead = 0;
        this.authors = [];
    }

}

// Create constructor for book
function Book(title, author, pages, type, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.type = type;
    this.hasRead = hasRead;
}


function addBookToLibrary(book){
    
    // Update stats
    stats.totalBooks += 1;
    stats.totalPages += book.pages;
    if (book.hasRead){
        stats.pagesRead += book.pages;
        stats.booksRead += 1;
    } 
    stats.authors.push(book.author);
    stats.refresh();


    library.push(book);
}

function removeBookFromLibrary(index){
    
    // Update stats
    stats.totalBooks -= 1;
    stats.totalPages -= parseInt(library[index].pages);
    if (library[index].hasRead){
        stats.pagesRead -= parseInt(library[index].pages);
        stats.booksRead -= 1;
    } 
    stats.authors.splice(`'${library[index].pages}'`, 1)
    stats.refresh(); 
    
    // Remove book from library array
    library.splice(index, 1)
}

// Clear library array and DOMs to prepare for screen refresh
// runs on every book deletion
function clearLibrary(){
    
    resetConfirmScreen.style.display = 'none';
    const bookstoDelete = document.querySelectorAll('.book');
    bookstoDelete.forEach(book => book.remove());
}

//////// Test books ///////////////////////////////
const Fellowship = new Book("Fellowship of the Ring", "J.R.R. Tolkien", 423, "Fantasy", false);
const OryxCrake = new Book("Oryx and Crake", "Margaret Atwood", 400, "Sci-fi", true);

addBookToLibrary(OryxCrake);
addBookToLibrary(Fellowship);
/////////////////////////////////////////////////////


// Display entire library, after clear or page load
function displayLibrary(){

    let myLibrary = document.querySelector('#booklist');
  
    for (let book in library){
        displayBook(book);
    }

}

// Display book at last library array index
function displayBook(libraryIndex)
{
    
    if (libraryIndex == null) return console.warn('library index number required');

    book = libraryIndex;

    // Create a book container
    const story = document.createElement("li");
    setAttributes(story, {"class": `book`, "id": `book${book}`, "data-library-index": `${book}`});

    // Attach attributes to display
    story.appendChild(addAttributeToBook(library[book].title, 'h3'));
    
    const author = addAttributeToBook("Author: ", 'div');
    author.appendChild(addAttributeToBook(library[book].author, 'p'));
    story.appendChild(author);
    
    const pages = addAttributeToBook("Pages: ", 'div')
    pages.appendChild(addAttributeToBook(library[book].pages, 'p'))
    story.appendChild(pages);

    const type = addAttributeToBook("Genre: ", 'div');
    type.appendChild(addAttributeToBook(library[book].type, 'p'));
    story.appendChild(type);

    // Create container for 'Read' and 'Delete' buttons
    const bookButtons = addAttributeToBook('Read?', 'div')
    setAttributes(bookButtons, {'class': `book-buttons }`})
    
    // Create read book toggle
    const hasRead = document.createElement('input');
    setAttributes(hasRead, {'type': 'button', 'class': `read-button ${(library[book].hasRead) && 'hasread'}`})
    hasRead.addEventListener('click', () => {
        const bookIndex = getParentWithClass(hasRead, 'book').getAttribute('data-library-index')

        // Flips read status on click
        setBookReadStatus(hasRead, !library[bookIndex].hasRead)
    });
    bookButtons.appendChild(hasRead);

    // Create remove book popup
    const removeBtn = document.createElement("input");
    setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});  
    removeBtn.addEventListener('click', () => {
       
        deleteScreen.currentBook = story;  
        deleteConfirmScreen.style.display = "flex";
 
        const deleteTitleText = document.querySelector('#book-to-delete') 
        const index = story.getAttribute('data-library-index');  
        deleteTitleText.textContent = library[index].title;           
    })
    
    bookButtons.appendChild(removeBtn);
    story.appendChild(bookButtons);
    myLibrary.appendChild(story);
}

// Toggles book read status for card
function setBookReadStatus(button, haveRead){
    
    const index = getParentWithClass(button, 'book').getAttribute('data-library-index')
    library[index].hasRead = haveRead;
   
    if (haveRead){
        button.classList.add('hasread')
        stats.booksRead += 1;
        stats.pagesRead += library[index].pages;
     }
     else{
         button.classList.remove('hasread');
         stats.booksRead -= 1;
         stats.pagesRead -= library[index].pages;
    
        }
    stats.refresh();
}

// Using object to attach book marked for deletion for deletion prompt
// First button will store book in this object, second button will call deleteBook method on it
let deleteScreen = {

    currentBook: 'none',

    deleteBook(){
        this.currentBook.remove();
        removeBookFromLibrary(this.currentBook.getAttribute('data-library-index'));
        clearLibrary();
        displayLibrary();
    }
}

///////////////////
// Helper functions
//////////////////

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

// Recursively search through parents for a specific DOM with specified class
function getParentWithClass(node, nodeClass){

    // Return if class not found in document
    if (node.tagName == 'HTML'){
        console.warn("No DOM with that class")
        return;
    }
    if (node.parentNode.className == nodeClass) {
        return(node.parentNode);
    }
    return(getParentWithClass(node.parentNode, nodeClass));
}


// Event listeners
const confirmDeleteBook= document.querySelector('#confirm-delete');
confirmDeleteBook.addEventListener('click', () => {
    deleteConfirmScreen.style.display = 'none';
    deleteScreen.deleteBook();
})


const addBookPopUp = document.querySelector("#add-book");
    addBookPopUp.addEventListener("click", () => {
        addBookDisplay.style.display = "flex";
        myLibrary.style.opacity = ".25";
    });

const closeDeleteModal = document.querySelector('#cancel-delete');
closeDeleteModal.addEventListener('click', () => deleteConfirmScreen.style.display = "none");


const closeAddModal = document.querySelector('#exit-form');
closeAddModal.addEventListener('click', () => {
    addBookDisplay.style.display = 'none';
    myLibrary.style.opacity = "1.0";

})

const resetButtonPrompt = document.querySelector('#reset-library');
resetButtonPrompt.addEventListener('click', () => { resetConfirmScreen.style.display = "flex";

})

const resetButtonConfirm = document.querySelector('#confirm-reset');
resetButtonConfirm.addEventListener('click',() => {
    stats.reset();
    stats.refresh();
    clearLibrary();
});
const resetButtonCancel = document.querySelector('#cancel-reset');
resetButtonCancel.addEventListener('click', () => resetConfirmScreen.style.display = "none");
/////

// Create book from user input
const addBook = document.querySelector('form');
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
    
    // Need to subtract 1 from library.length for proper indexing
    displayBook(library.length - 1);
});
    


// Initialize
displayLibrary();
stats.refresh();