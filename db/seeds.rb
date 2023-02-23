# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password') if Rails.env.development?
Emotion.create!([{
    word: "Satisfied",
    category: "positive"
  },
  {
    word: "Enthusiastic",
    category: "positive"
  },
  {
    word: "Excited",
    category: "positive"
  },
  {
    word: "Energetic",
    category: "positive"
  },
  {
    word: "Happy",
    category: "positive"
  },
  {
    word: "Joyful",
    category: "positive"
  },
  {
    word: "Inspired",
    category: "positive"
  },
  {
    word: "Proud",
    category: "positive"
  },
  {
    word: "Confident",
    category: "positive"
  },
  {
    word: "Belonging",
    category: "positive"
  },
  {
    word: "Amazing",
    category: "positive"
  },
  {
    word: "Great",
    category: "positive"
  },
  {
    word: "Special",
    category: "positive"
  },
  {
    word: "Effective",
    category: "positive"
  },
  {
    word: "Successful",
    category: "positive"
  },
  {
    word: "Fantastic",
    category: "positive"
  },
  {
    word: "Terrific",
    category: "positive"
  },
  {
    word: "Awesome",
    category: "positive"
  },
  {
    word: "Wow",
    category: "positive"
  },
  {
    word: "Relaxed",
    category: "neutral"
  },
  {
    word: "Peaceful",
    category: "neutral"
  },
  {
    word: "Calm",
    category: "neutral"
  },
  {
    word: "Serene",
    category: "neutral"
  },
  {
    word: "Fine",
    category: "neutral"
  },
  {
    word: "Alright",
    category: "neutral"
  },
  {
    word: "Ok",
    category: "neutral"
  },
  {
    word: "Busy",
    category: "neutral"
  },
  {
    word: "Dull",
    category: "neutral"
  },
  {
    word: "Slow",
    category: "neutral"
  },
  {
    word: "Easy",
    category: "neutral"
  },
  {
    word: "Surprised",
    category: "neutral"
  },
  {
    word: "Relieved",
    category: "neutral"
  },
  {
    word: "Interested",
    category: "neutral"
  },
  {
    word: "Hopeful",
    category: "neutral"
  },
  {
    word: "Fun",
    category: "neutral"
  },
  {
    word: "Cool",
    category: "neutral"
  },
  {
    word: "Laid-back",
    category: "neutral"
  },
  {
    word: "Not bad",
    category: "neutral"
  },
  {
    word: "So so",
    category: "neutral"
  },
  {
    word: "Frustrated",
    category: "negative"
  },
  {
    word: "Stressed",
    category: "negative"
  },
  {
    word: "Anxious",
    category: "negative"
  },
  {
    word: "Worried",
    category: "negative"
  },
  {
    word: "Angry",
    category: "negative"
  },
  {
    word: "Disappointed",
    category: "negative"
  },
  {
    word: "Exasperated",
    category: "negative"
  },
  {
    word: "Annoyed",
    category: "negative"
  },
  {
    word: "Bored",
    category: "negative"
  },
  {
    word: "Miserable",
    category: "negative"
  },
  {
    word: "Sad",
    category: "negative"
  },
  {
    word: "Tired",
    category: "negative"
  },
  {
    word: "Uncomfortable",
    category: "negative"
  },
  {
    word: "Unhappy",
    category: "negative"
  },
  {
    word: "Upset",
    category: "negative"
  },
  {
    word: "Disinterested",
    category: "negative"
  },
  {
    word: "Dissatisfied",
    category: "negative"
  },
  {
    word: "Gloomy",
    category: "negative"
  },
  {
    word: "Confused",
    category: "negative"
  },
  {
    word: "Rushed",
    category: "negative"
  },
  {
    word: "Helpless",
    category: "negative"
  },
  {
    word: "Threatened",
    category: "negative"
  },
  {
    word: "Burned-out",
    category: "negative"
  }])
  