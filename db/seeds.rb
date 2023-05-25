
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if AdminUser.count.zero? && ENV['ADMIN_USER'] && ENV['ADMIN_PASSWORD']
  AdminUser.create!(email: ENV['ADMIN_USER'], password: ENV['ADMIN_PASSWORD'], password_confirmation: ENV['ADMIN_PASSWORD'])
end

if Emotion.count.zero?
  seed_file = Rails.root.join('db', 'seeds', 'starting_emotions.yml')
  contents = YAML::load_file(seed_file)

  contents.each do |category_and_words|
    category = category_and_words.first
    words_list = category_and_words.second

    words_list.each { |word| Emotion.create(word: word, category: category, public: true) }
  end
end

if FunQuestion.count.zero?
  questions = YAML::load_file(Rails.root.join('db', 'seeds', 'default_questions.yml'))

  questions['questions'].each do |question|
    FunQuestion.create(question_body: question['question_body'], public: true)
  end
end
