module ApiHelpers
  def json
    JSON.parse(response.body).deep_symbolize_keys
  end

  def json_data
    json[:data]
  end

  def count_word_in_obj(word, object)
    (object.to_s.gsub word).count
  end
end
