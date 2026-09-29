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


const booksCount = document.querySelector('#books-count'); 
function renderBooks(booksArray) {
  listContainer.innerHTML = '';

  for (const book of booksArray) {
  const article = document.createElement('article');   
    const title = document.createElement('h3');
    const author = document.createElement('p');

    title.textContent = book.title;                     
    author.textContent = `Автор: ${book.author}`;        

   article.dataset.pages = book.pages;//додає атрибут data-pages до елемента article, який містить кількість сторінок книги (book.pages)       

    if (!book.finished) {                        
      article.classList.add('unread');        //додає клас unread до елемента article, якщо книга не прочитана (finished === false)    
    }

    article.append(title, author);

     listContainer.append(article);//додає елемент article до контейнера listContainer, який містить список книг
  }

   booksCount.textContent = `Всього книг: ${booksArray.length}`;
}

renderBooks(books);

console.log(`Середня кількість сторінок на день: ${pagesPerDay(sumOfPages, 30)}`);//виводить середню кількість сторінок на день, яку потрібно прочитати, щоб закінчити всі непрочитані книги за 30 днів. Використовує функцію pagesPerDay для обчислення цього значення.