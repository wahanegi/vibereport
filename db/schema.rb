# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_02_10_062915) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.bigint "author_id"
    t.string "author_type"
    t.text "body"
    t.datetime "created_at", null: false
    t.string "namespace"
    t.bigint "resource_id"
    t.string "resource_type"
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "emojis", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "emoji_code"
    t.string "emoji_name"
    t.bigint "emojiable_id"
    t.string "emojiable_type"
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["emoji_code", "user_id", "emojiable_type", "emojiable_id"], name: "index_unique_emojis", unique: true
    t.index ["emojiable_type", "emojiable_id"], name: "index_emojis_on_emojiable"
    t.index ["user_id"], name: "index_emojis_on_user_id"
  end

  create_table "emotions", force: :cascade do |t|
    t.integer "category", default: 1
    t.datetime "created_at", null: false
    t.boolean "public", default: false
    t.datetime "updated_at", null: false
    t.string "word"
  end

  create_table "fun_question_answers", force: :cascade do |t|
    t.text "answer_body"
    t.datetime "created_at", null: false
    t.bigint "fun_question_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["fun_question_id"], name: "index_fun_question_answers_on_fun_question_id"
    t.index ["user_id"], name: "index_fun_question_answers_on_user_id"
  end

  create_table "fun_questions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "public", default: false, null: false
    t.string "question_body"
    t.bigint "time_period_id"
    t.datetime "updated_at", null: false
    t.boolean "used", default: false, null: false
    t.bigint "user_id"
    t.index ["question_body"], name: "index_fun_questions_on_question_body", unique: true
    t.index ["time_period_id"], name: "index_fun_questions_on_time_period_id"
    t.index ["user_id"], name: "index_fun_questions_on_user_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "details"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.boolean "viewed", default: false, null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "code"
    t.string "company"
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_projects_on_code", unique: true
  end

  create_table "responses", force: :cascade do |t|
    t.string "celebrate_comment"
    t.text "comment"
    t.date "completed_at"
    t.datetime "created_at", null: false
    t.boolean "draft", default: false, null: false
    t.bigint "emotion_id"
    t.bigint "fun_question_answer_id"
    t.bigint "fun_question_id"
    t.jsonb "gif"
    t.boolean "not_working", default: false
    t.jsonb "notices"
    t.integer "productivity"
    t.text "productivity_comment"
    t.integer "rating"
    t.bigint "shoutout_id"
    t.string "steps"
    t.bigint "time_period_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["emotion_id"], name: "index_responses_on_emotion_id"
    t.index ["fun_question_answer_id"], name: "index_responses_on_fun_question_answer_id"
    t.index ["fun_question_id"], name: "index_responses_on_fun_question_id"
    t.index ["shoutout_id"], name: "index_responses_on_shoutout_id"
    t.index ["time_period_id"], name: "index_responses_on_time_period_id"
    t.index ["user_id", "time_period_id"], name: "index_responses_on_user_id_and_time_period_id", unique: true
    t.index ["user_id"], name: "index_responses_on_user_id"
  end

  create_table "shoutout_recipients", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "shoutout_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["shoutout_id"], name: "index_shoutout_recipients_on_shoutout_id"
    t.index ["user_id"], name: "index_shoutout_recipients_on_user_id"
  end

  create_table "shoutouts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "public", default: true, null: false
    t.text "rich_text", null: false
    t.bigint "time_period_id", null: false
    t.string "type"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["rich_text", "user_id", "time_period_id"], name: "index_shoutouts_on_rich_text_and_user_id_and_time_period_id", unique: true
    t.index ["time_period_id"], name: "index_shoutouts_on_time_period_id"
    t.index ["user_id"], name: "index_shoutouts_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", limit: 100, null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_teams_on_name", unique: true
  end

  create_table "time_periods", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "due_date"
    t.date "end_date"
    t.string "slug"
    t.date "start_date"
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_time_periods_on_slug", unique: true
  end

  create_table "time_sheet_entries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "project_id", null: false
    t.bigint "time_period_id", null: false
    t.integer "total_hours", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["project_id"], name: "index_time_sheet_entries_on_project_id"
    t.index ["time_period_id"], name: "index_time_sheet_entries_on_time_period_id"
    t.index ["user_id"], name: "index_time_sheet_entries_on_user_id"
  end

  create_table "user_teams", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "role", default: 0, null: false
    t.bigint "team_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["team_id"], name: "index_user_teams_on_team_id"
    t.index ["user_id", "team_id"], name: "index_user_teams_on_user_id_and_team_id", unique: true
    t.index ["user_id"], name: "index_user_teams_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.boolean "not_ask_visibility", default: false, null: false
    t.boolean "opt_out", default: false
    t.datetime "remember_created_at"
    t.string "remember_token"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "time_period_index", default: 0
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "fun_question_answers", "fun_questions"
  add_foreign_key "fun_question_answers", "users"
  add_foreign_key "fun_questions", "time_periods"
  add_foreign_key "fun_questions", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "responses", "emotions"
  add_foreign_key "responses", "fun_question_answers"
  add_foreign_key "responses", "fun_questions"
  add_foreign_key "responses", "shoutouts"
  add_foreign_key "responses", "time_periods"
  add_foreign_key "responses", "users"
  add_foreign_key "shoutout_recipients", "shoutouts"
  add_foreign_key "shoutout_recipients", "users"
  add_foreign_key "shoutouts", "time_periods"
  add_foreign_key "shoutouts", "users"
  add_foreign_key "time_sheet_entries", "projects"
  add_foreign_key "time_sheet_entries", "time_periods"
  add_foreign_key "time_sheet_entries", "users"
  add_foreign_key "user_teams", "teams"
  add_foreign_key "user_teams", "users"
end
