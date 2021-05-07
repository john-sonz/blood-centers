# Aplikacja wspomagająca centrum krwiodawstwa

## Mini-projekt z przedmiotu Bazy danych, semestr 4, rok akademicki 2020/2021

### Autorzy

- Barbara Kulawska ([@bkulawska](https://github.com/bkulawska))
- Kinga Sąkól ([@kingasakol](https://github.com/kingasakol))
- Jan Zborowski ([@john-sonz](https://github.com/john-sonz))

### Uruchomienie projektu

Wymagania:

- Node.js (najlepiej w wersji 15.14.0 lub nowszej)
- Docker for desktop

Aby uruchomić projekt należy wykonać następujące polecenia:

```
git clone https://github.com/john-sonz/blood-centers.git
cd blood-centers/backend && npm install
cd .. && docker-compose up
```

Backend będzie dostępny pod adresem http://localhost:4000.
W trakcie pracy nad aplikacją potrzebne będzię również uruchomienie kompilatora języka Typescript w osobnym terminalu:

```
# w katalogu backend
npm run watch
```
