puts "Seeding database..."

admin = User.find_or_create_by!(email: "admin@portals.local") do |u|
  u.username = "admin"
  u.password = "password123"
  u.password_confirmation = "password123"
  u.role = :admin
end
puts "  Admin: admin@portals.local / password123"

user1 = User.find_or_create_by!(email: "gamer@portals.local") do |u|
  u.username = "pro_gamer"
  u.password = "password123"
  u.password_confirmation = "password123"
end

user2 = User.find_or_create_by!(email: "reviewer@portals.local") do |u|
  u.username = "game_reviewer"
  u.password = "password123"
  u.password_confirmation = "password123"
end
puts "  Users: gamer@portals.local, reviewer@portals.local / password123"

genres = %w[RPG FPS Action Adventure Strategy Simulation Puzzle Racing Sports Horror Indie].map do |name|
  Genre.find_or_create_by!(name: name)
end
puts "  #{genres.count} genres created"

games_data = [
  { title: "The Witcher 3: Wild Hunt", developer: "CD Projekt Red", publisher: "CD Projekt",
    release_date: "2015-05-19", description: "Масштабная ролевая игра с открытым миром, основанная на серии книг Анджея Сапковского.",
    genres: [ "RPG", "Action", "Adventure" ] },
  { title: "Cyberpunk 2077", developer: "CD Projekt Red", publisher: "CD Projekt",
    release_date: "2020-12-10", description: "Экшн-RPG в открытом мире мегаполиса Найт-Сити.",
    genres: [ "RPG", "Action", "FPS" ] },
  { title: "Elden Ring", developer: "FromSoftware", publisher: "Bandai Namco",
    release_date: "2022-02-25", description: "Масштабная экшн-RPG в открытом мире, созданная Хидэтака Миядзаки и Джорджем Мартином.",
    genres: [ "RPG", "Action" ] },
  { title: "Baldur's Gate 3", developer: "Larian Studios", publisher: "Larian Studios",
    release_date: "2023-08-03", description: "Классическая RPG с пошаговыми боями, основанная на системе D&D 5e.",
    genres: [ "RPG", "Strategy", "Adventure" ] },
  { title: "Counter-Strike 2", developer: "Valve", publisher: "Valve",
    release_date: "2023-09-27", description: "Легендарный соревновательный шутер обновлён на движке Source 2.",
    genres: [ "FPS", "Action" ] },
  { title: "Stardew Valley", developer: "ConcernedApe", publisher: "ConcernedApe",
    release_date: "2016-02-26", description: "Симулятор фермы с элементами RPG и социальными механиками.",
    genres: [ "Simulation", "RPG", "Indie" ] },
  { title: "Hollow Knight", developer: "Team Cherry", publisher: "Team Cherry",
    release_date: "2017-02-24", description: "Метроидвания в мрачном подземном королевстве насекомых.",
    genres: [ "Action", "Adventure", "Indie" ] },
  { title: "Civilization VI", developer: "Firaxis Games", publisher: "2K Games",
    release_date: "2016-10-21", description: "Пошаговая стратегия мирового масштаба о развитии цивилизации.",
    genres: [ "Strategy", "Simulation" ] },
  { title: "DOOM Eternal", developer: "id Software", publisher: "Bethesda",
    release_date: "2020-03-20", description: "Интенсивный FPS, продолжение легендарной серии.",
    genres: [ "FPS", "Action" ] },
  { title: "Resident Evil 4 Remake", developer: "Capcom", publisher: "Capcom",
    release_date: "2023-03-24", description: "Ремейк культового хоррора с обновлённой графикой и геймплеем.",
    genres: [ "Horror", "Action", "Adventure" ] }
]

games = games_data.map do |data|
  genre_names = data.delete(:genres)
  game = Game.find_or_create_by!(title: data[:title]) do |g|
    g.assign_attributes(data)
  end
  genre_names.each do |gn|
    genre = Genre.find_by(name: gn)
    GameGenre.find_or_create_by!(game: game, genre: genre) if genre
  end
  game
end
puts "  #{games.count} games created"

articles_data = [
  { title: "Elden Ring получила расширение Shadow of the Erdtree",
    body: "FromSoftware выпустила масштабное DLC для Elden Ring. Расширение Shadow of the Erdtree добавляет новую обширную локацию, более 10 новых боссов, десятки единиц оружия и заклинаний. По мнению критиков, DLC не уступает основной игре по качеству дизайна уровней.\n\nИгрокам предстоит исследовать Realm of Shadow — загадочную область, скрытую в тени Древа Эрд. Новые механики включают систему благословений, которая позволяет усиливать персонажа в рамках DLC.\n\nСредний балл на Metacritic — 94/100.",
    game: "Elden Ring" },
  { title: "Counter-Strike 2: новый сезон соревнований",
    body: "Valve объявила о начале нового соревновательного сезона в CS2. Обновлена система рейтинга, добавлены новые карты в соревновательный пул. Крупнейшие турнирные организаторы уже подтвердили проведение серии турниров с призовым фондом более $5 млн.\n\nКлючевые изменения: переработан Dust II, обновлена система дымовых гранат, улучшена сетевая инфраструктура серверов.",
    game: "Counter-Strike 2" },
  { title: "Baldur's Gate 3: патч 7 с мастерскими мод-инструментами",
    body: "Larian Studios выпустила Patch 7 для Baldur's Gate 3, который включает официальные мод-инструменты. Игроки смогут создавать собственные истории, персонажей и кампании с помощью встроенного редактора.\n\nПатч также добавляет split-screen для PC, исправляет более 1000 ошибок и оптимизирует производительность. Larian подчеркнула, что это крупнейшее обновление с момента выхода игры.",
    game: "Baldur's Gate 3" },
  { title: "Топ-5 инди-игр 2024 года, которые стоит попробовать",
    body: "Инди-сцена продолжает радовать уникальными проектами. Мы собрали пять игр, которые покорили критиков и игроков:\n\n1. Animal Well — метроидвания-головоломка с минималистичным стилем.\n2. Balatro — рогалик на основе покерных механик.\n3. Hades II (ранний доступ) — продолжение хита Supergiant Games.\n4. Neva — платформер от создателей Gris.\n5. Thank Goodness You're Here — комедийное приключение.\n\nКаждая из этих игр предлагает что-то уникальное.",
    game: nil },
  { title: "Что нового в мире киберспорта — итоги сезона",
    body: "Подводим итоги киберспортивного сезона. CS2 утвердился как главная дисциплина, Dota 2 провела рекордный The International, а Valorant продолжает набирать аудиторию.\n\nОбщий призовой фонд основных турниров превысил $100 млн. Организаторы всё больше инвестируют в инфраструктуру, строятся новые арены в Азии и Европе.",
    game: nil }
]

articles_data.each do |data|
  game = data[:game] ? Game.find_by(title: data[:game]) : nil
  Article.find_or_create_by!(title: data[:title]) do |a|
    a.body = data[:body]
    a.user = admin
    a.game = game
    a.published_at = rand(30).days.ago
  end
end
puts "  #{articles_data.count} articles created"

reviews_data = [
  { user: user1, game: "The Witcher 3: Wild Hunt", title: "Шедевр на все времена", body: "Одна из лучших RPG, в которые я играл. Невероятный сюжет, живые персонажи и огромный мир.", rating: 10 },
  { user: user1, game: "Cyberpunk 2077", title: "Стало лучше после патчей", body: "На старте было много проблем, но сейчас игра вышла на отличный уровень. Особенно после DLC Phantom Liberty.", rating: 8 },
  { user: user2, game: "The Witcher 3: Wild Hunt", title: "Лучшая RPG десятилетия", body: "Потрясающая история, особенно DLC Кровь и Вино. Геральт — один из лучших протагонистов в играх.", rating: 10 },
  { user: user2, game: "Elden Ring", title: "Сложно, но справедливо", body: "Открытый мир прекрасен, боссы запоминающиеся. Лучшая игра FromSoftware.", rating: 9 },
  { user: user1, game: "Hollow Knight", title: "Инди-жемчужина", body: "За небольшую цену — огромная красивая игра с отличным геймплеем и атмосферой.", rating: 9 },
  { user: user2, game: "Baldur's Gate 3", title: "Новый стандарт RPG", body: "Larian создала RPG мечты. Свобода выбора, великолепная боевая система, множество путей прохождения.", rating: 10 }
]

reviews_data.each do |data|
  game = Game.find_by!(title: data[:game])
  Review.find_or_create_by!(user: data[:user], game: game) do |r|
    r.title = data[:title]
    r.body = data[:body]
    r.rating = data[:rating]
  end
end
puts "  #{reviews_data.count} reviews created"

puts "Seeding complete!"
