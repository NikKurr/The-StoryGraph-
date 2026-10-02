console.log('script.js підключено')

const placeholders = document.querySelectorAll('#books-list article');

for (const placeholder of placeholders) {
  placeholder.remove();
}

const books = [//створює масив об'єктів books, де кожен об'єкт представляє книгу з властивостями title (назва), author (автор), pages (кількість сторінок) та finished (чи прочитана книга)
  { title: "Маленький принц", author: "Антуан де Сент-Екзюпері", pages: 76, finished: true },
  { title: "На західному фронті без змін", author: "Еріх Марія Ремарк", pages: 240, finished: true },
  { title: "1984", author: "Джордж Орвелл", pages: 328, finished: false },
  { title: "Кобзар", author: "Тарас Шевченко", pages: 210, finished: true },
  { title: "Гаррі Поттер і філософський камінь", author: "Джоан Роулінг", pages: 320, finished: false },
  { title: "Тіні забутих предків", author: "Михайло Коцюбинський", pages: 96, finished: false }
];
const listContainer = document.getElementById('books-list');

let sumOfPages = 0;//створює змінну sumOfPages і присвоює їй початкове значення 0
for (let i = 0; i < books.length; i++) {//цикл for, який проходить по всіх елементах масиву books
  console.log(`Книга: ${books[i].title}, сторінки: ${books[i].pages}, прочитано: ${books[i].finished}`);//виводить інформацію про кожну книгу в консоль
  if (books[i].finished === false) {//логічна перевірка, яка перевіряє, чи книга не прочитана (finished === false)
    sumOfPages += books[i].pages;//якщо книга не прочитана, додає кількість сторінок цієї книги до змінної sumOfPages
  }
  console.log(`Сума сторінок: ${sumOfPages}`);//виводить поточну суму сторінок, які ще потрібно прочитати, в консоль
}

const pagesPerDay = (pages, days) => Math.round(pages / days);//функція, яка приймає два параметри: pages (кількість сторінок) і days (кількість днів). Вона обчислює середню кількість сторінок на день, ділячи pages на days і округлюючи результат до найближчого цілого числа за допомогою Math.round().

const finishedCountEl = document.querySelector('#finished-count');  
const readingCountEl = document.querySelector('#reading-count');     
const booksCount = document.querySelector('#books-count'); 

function renderBooks(booksArray) {
  listContainer.innerHTML = '';

  let finishedTotal = 0;

  for (let i = 0; i < booksArray.length; i++) {           
    const book = booksArray[i];                            

    const article = document.createElement('article');
    const title = document.createElement('h3');
    const author = document.createElement('p');

    const bookStatus = document.createElement('select');       // вибір статусу в картці
    const readingOption = document.createElement('option');    
    const doneOption = document.createElement('option');       
    readingOption.value = 'reading';                           // ті самі значення, що й у формі
    readingOption.textContent = 'Читаю';
    doneOption.value = 'done';
    doneOption.textContent = 'Прочитано';
    doneOption.selected = book.finished;                       // true вибирає «Прочитано»
    bookStatus.dataset.index = i;                              //за цим номером handleStatusChange знайде книгу в масиві
    bookStatus.append(readingOption, doneOption);              //пункти вкладено в select

    if (book.finished) {
      finishedTotal++;
    }

    title.textContent = book.title;
    author.textContent = `Автор: ${book.author}`;

    article.dataset.pages = book.pages;

    if (!book.finished) {
      article.classList.add('unread');
    }

    article.append(title, author, bookStatus);             // article.append(title, author)

    listContainer.append(article);
  }

  booksCount.textContent = `Всього книг: ${booksArray.length}`;
  finishedCountEl.textContent = `Прочитано: ${finishedTotal}`;
  readingCountEl.textContent = `У процесі: ${booksArray.length - finishedTotal}`;
}

renderBooks(books);

listContainer.addEventListener('change', handleStatusChange);   
function handleStatusChange(event) {
  if (!event.target.matches('select')) {                        // ігноруємо події не від select
    return;
  }

  const index = Number(event.target.dataset.index);             // "2" рядком стає числом 2
  books[index].finished = event.target.value === 'done';        //те саме правило, що у handleSubmit

  renderBooks(books);                                           // оновлює картки, клас unread і лічильники
}

console.log(`Середня кількість сторінок на день: ${pagesPerDay(sumOfPages, 30)}`);//виводить середню кількість сторінок на день, яку потрібно прочитати, щоб закінчити всі непрочитані книги за 30 днів.

const form = document.querySelector('#book-form');
const titleInput = document.querySelector('#title');     
const authorInput = document.querySelector('#author');     
const pagesInput = document.querySelector('#pages');      
const statusSelect = document.querySelector('#status');    
//встановлюємо константи для елементів форми, які відповідають за введення даних про книгу


authorInput.addEventListener('input', handleAuthorInput);   
function handleAuthorInput() {                            
  if (authorInput.validity.patternMismatch) {               
    authorInput.setCustomValidity("Ім'я автора не повинно містити цифр");  
  } else {
    authorInput.setCustomValidity('');                      
  }
}

form.addEventListener('submit', handleSubmit);
function handleSubmit(event){
event.preventDefault();

 const title = titleInput.value.trim();     //Trim видаляє пробіли на початку і в кінці
  const author = authorInput.value.trim();  //Trim видаляє пробіли на початку і в кінці
  const pages = Number(pagesInput.value);    //число 
  const status = statusSelect.value;    

    const newBook = {                       // нове: об'єкт з тими самими ключами, що й у books
    title: title,                         // ключ title, значення зі змінної title
    author: author,
    pages: pages,
    finished: status === 'done'           // нове: порівняння саме повертає true або false
  };

  books.push(newBook);     

  renderBooks(books); //оновлює список книг на сторінці, викликаючи функцію renderBooks з оновленим масивом books
  console.log(title, author, pages, status); //Заглушка
  console.log(typeof pages);         
  form.reset(); //очищає форму після відправки, викликаючи метод reset() на елементі форми form
}