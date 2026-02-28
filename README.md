# Portals — Игровой веб-портал

Веб-портал для индустрии компьютерных игр на Ruby on Rails.

## Функционал

- **Каталог игр** — карточки игр с жанрами, рейтингами, фильтрацией и пагинацией
- **Новости** — публикация статей (админ), комментарии и лайки
- **Отзывы** — пользовательские обзоры игр с оценкой 1–10
- **Аутентификация** — регистрация, вход (Devise)
- **Авторизация** — 2 роли: user и admin (Pundit)
- **Профили** — страницы пользователей с историей активности
- **Админ-панель** — статистика и управление контентом

## Стек технологий

- Ruby 3.2 / Rails 7.2
- PostgreSQL 16
- Bootstrap 5 + Hotwire (Turbo/Stimulus)
- Devise, Pundit, Kaminari
- RSpec, FactoryBot, Shoulda Matchers, Capybara

## Запуск (локально)

```bash
# Установка зависимостей
bundle install

# Настройка БД
bin/rails db:create db:migrate db:seed

# Запуск сервера
bin/rails server
```

Приложение доступно по адресу http://localhost:3000

## Запуск (Docker)

Из корня репозитория:

```bash
docker compose up --build
```

## Тестовые аккаунты

| Роль  | Email               | Пароль      |
|-------|---------------------|-------------|
| Admin | admin@portals.local | password123 |
| User  | gamer@portals.local | password123 |

## Тесты

```bash
bundle exec rspec
```

## Структура проекта

```
app/
├── controllers/    # Контроллеры (Games, Articles, Reviews, Comments, Likes, Admin)
├── models/         # AR-модели с валидациями, ассоциациями, скоупами
├── views/          # ERB-шаблоны с Bootstrap 5
├── policies/       # Pundit-политики авторизации
spec/
├── models/         # Юнит-тесты моделей
├── policies/       # Тесты политик
├── requests/       # Интеграционные тесты контроллеров
├── factories/      # FactoryBot фабрики
```
