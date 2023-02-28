# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if Rails.env.development? && AdminUser.count.zero?
  AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
end

if Emotion.count.zero?
  seed_file = Rails.root.join('db', 'seeds', 'starting_emotions.yml')
  contents = YAML::load_file(seed_file)

  contents.each do |category_and_words|
    category = category_and_words.first
    words_list = category_and_words.second

    words_list.each { |word| Emotion.create(word: word, category: category) }
  end
end
